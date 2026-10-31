import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/configuration';

/** 单次模型调用结果（图片类）。 */
export interface ImageGenResult {
  outUrl?: string;
  outPath?: string;
  costMs: number;
  error?: string;
}

/** LLM 文本产出（大纲/分镜）。 */
export interface TextGenResult {
  content: string;
  costMs: number;
  error?: string;
}

/** 视频任务创建结果。 */
export interface VideoTaskResult {
  videoId?: string;
  costMs: number;
  error?: string;
}

/** 视频任务轮询结果。 */
export interface VideoPollResult {
  status: 'pending' | 'running' | 'completed' | 'failed';
  url?: string;
  error?: string;
}

@Injectable()
export class AgnesService {
  private readonly logger = new Logger(AgnesService.name);

  constructor(private readonly config: ConfigService) {}

  private baseUrl(): string {
    return this.config.get<AppConfig>('app').agnes.baseUrl.replace(/\/$/, '');
  }
  private apiKey(): string {
    return this.config.get<AppConfig>('app').agnes.apiKey;
  }
  private imageModel(): string {
    return this.config.get<AppConfig>('app').agnes.imageModel;
  }
  /** 当前生图模型名（供业务层回溯记录，不涉及密钥）。 */
  imageModelName(): string {
    return this.imageModel();
  }
  private textModel(): string {
    return this.config.get<AppConfig>('app').agnes.textModel;
  }
  private videoModel(): string {
    return this.config.get<AppConfig>('app').agnes.videoModel;
  }
  private videoApiPath(): string {
    return this.config.get<AppConfig>('app').agnes.videoApiPath;
  }
  private timeoutMs(): number {
    return this.config.get<AppConfig>('app').agnes.timeoutMs;
  }

  /**
   * 文本推理（大纲 / 分镜脚本）。Key 缺失或失败时优雅返回 {error}，不抛。
   * @param prompt 用户 prompt
   * @param system 系统角色（可选）
   */
  async generateText(prompt: string, system?: string): Promise<TextGenResult> {
    const start = Date.now();
    if (!this.apiKey()) {
      return { content: '', costMs: 0, error: 'AGNES_API_KEY missing' };
    }
    const messages = [
      ...(system ? [{ role: 'system', content: system }] : []),
      { role: 'user', content: prompt },
    ];
    try {
      const res = await fetch(`${this.baseUrl()}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey()}`,
        },
        body: JSON.stringify({ model: this.textModel(), messages, temperature: 0.4 }),
        signal: AbortSignal.timeout(this.timeoutMs()),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        this.logger.warn(`agnes llm ${res.status}: ${text.slice(0, 200)}`);
        return { content: '', costMs: Date.now() - start, error: `agnes llm ${res.status}` };
      }
      const data: any = await res.json();
      const content = data?.choices?.[0]?.message?.content ?? '';
      return { content, costMs: Date.now() - start };
    } catch (e: any) {
      return { content: '', costMs: Date.now() - start, error: e?.message || String(e) };
    }
  }

  /**
   * 文生图（资产基础形象 / 关键帧 / 分镜画面）。
   * 参考图放 extra_body.image，response_format 放 extra_body（勿顶层）。
   */
  async generateImage(
    prompt: string,
    opts: { ratio?: string; size?: string; refImages?: string[] } = {},
  ): Promise<ImageGenResult> {
    const start = Date.now();
    if (!this.apiKey()) {
      return { costMs: 0, error: 'AGNES_API_KEY missing' };
    }
    const refs = (opts.refImages || []).filter(
      (u): u is string => typeof u === 'string' && u.length > 0,
    );
    const extraBody: Record<string, any> = { response_format: 'url' };
    // 实测 Agnes 接口：extra_body.image 传空数组会被判为非法请求（400
    // "extra_body.image must not be empty"），文生图（无参考图）必须省略该字段。
    if (refs.length) extraBody.image = refs;
    const body: Record<string, any> = {
      model: this.imageModel(),
      prompt,
      size: opts.size || '1K',
      extra_body: extraBody,
    };
    if (opts.ratio) body.ratio = opts.ratio;
    try {
      const res = await fetch(`${this.baseUrl()}/v1/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey()}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(this.timeoutMs()),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        this.logger.warn(`agnes image ${res.status}: ${text.slice(0, 200)}`);
        // 带上游 message，前端才能看到「为什么失败」而不是干巴巴的状态码
        let detail = '';
        try {
          const j = JSON.parse(text);
          detail = j?.error?.message ?? j?.message ?? '';
        } catch {
          detail = text.slice(0, 120);
        }
        return {
          costMs: Date.now() - start,
          error: detail ? `agnes image ${res.status}: ${detail}` : `agnes image ${res.status}`,
        };
      }
      const data: any = await res.json();
      const item = data?.data?.[0];
      const costMs = Date.now() - start;
      if (item?.url) return { outUrl: item.url, costMs };
      // b64 返回值转 data URL，保证 <img src> 可直接渲染（否则 "b64:xxx" 会裂图）
      if (item?.b64_json) {
        return { outUrl: `data:image/png;base64,${item.b64_json}`, costMs };
      }
      return { costMs, error: 'agnes image: no output' };
    } catch (e: any) {
      return { costMs: Date.now() - start, error: e?.message || String(e) };
    }
  }

  /** 创建 keyframe 视频任务（POST /v1/videos），返回 video_id。 */
  async createVideoTask(
    params: Record<string, any>,
  ): Promise<VideoTaskResult> {
    const start = Date.now();
    if (!this.apiKey()) {
      return { costMs: 0, error: 'AGNES_API_KEY missing' };
    }
    try {
      const body: Record<string, any> = { model: this.videoModel(), ...params };
      const res = await fetch(`${this.baseUrl()}/v1/videos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey()}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(this.timeoutMs()),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        this.logger.warn(`agnes video create ${res.status}: ${text.slice(0, 200)}`);
        return { costMs: Date.now() - start, error: `agnes video ${res.status}` };
      }
      const data: any = await res.json();
      const videoId = data?.id ?? data?.video_id ?? data?.data?.[0]?.id;
      if (!videoId) return { costMs: Date.now() - start, error: 'agnes video: no id' };
      return { videoId, costMs: Date.now() - start };
    } catch (e: any) {
      return { costMs: Date.now() - start, error: e?.message || String(e) };
    }
  }

  /** 轮询视频任务状态（GET /agnesapi?video_id=...&model_name=...）。 */
  async pollVideoTask(videoId: string): Promise<VideoPollResult> {
    if (!this.apiKey()) {
      return { status: 'failed', error: 'AGNES_API_KEY missing' };
    }
    try {
      const qs = `video_id=${encodeURIComponent(videoId)}&model_name=${encodeURIComponent(this.videoModel())}`;
      const res = await fetch(`${this.baseUrl()}${this.videoApiPath()}?${qs}`, {
        headers: { Authorization: `Bearer ${this.apiKey()}` },
        signal: AbortSignal.timeout(this.timeoutMs()),
      });
      if (!res.ok) {
        return { status: 'pending', error: `poll ${res.status}` };
      }
      const data: any = await res.json();
      const item = data?.data?.[0] ?? data;
      const status = String(item?.status ?? 'pending').toLowerCase();
      if (status === 'completed' || status === 'succeeded') {
        const url = item?.url ?? item?.video_url ?? item?.data?.url;
        return { status: 'completed', url };
      }
      if (status === 'failed' || status === 'error') {
        return { status: 'failed', error: item?.error || 'video task failed' };
      }
      return { status: 'running' };
    } catch (e: any) {
      // 轮询网络错误不置为 failed，保留 pending 可再查（PRD 异常流程）
      return { status: 'pending', error: e?.message || String(e) };
    }
  }
}

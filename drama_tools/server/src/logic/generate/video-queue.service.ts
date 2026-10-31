import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/configuration';
import { AgnesService } from './agnes.service';
import { buildVideoParams, BuildVideoInput } from './video-params';

/**
 * 视频任务轮询队列（复刻 sghouse 异步不阻塞原则）。
 * - 独立于请求处理器运行，幂等：同 keyframe_id+type=video 未终态不重复建。
 * - 轮询 1~2s 更新状态；单任务失败不影响其他；轮询超时保留 running 不误判失败。
 */
@Injectable()
export class VideoQueueService {
  private readonly logger = new Logger(VideoQueueService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly agnes: AgnesService,
  ) {}

  private pollInterval(): number {
    return this.config.get<AppConfig>('app').video.pollIntervalMs;
  }
  private pollTimeout(): number {
    return this.config.get<AppConfig>('app').video.pollTimeoutMs;
  }

  /**
   * 启动一次视频任务并轮询到终态。
   * @param onTick 每次轮询回调（更新 keyframe.video_status）
   * @returns 终态结果；轮询超时返回 failed(error='poll timeout') 但 keyframe 保留 running。
   */
  async run(
    keyframeId: number,
    input: BuildVideoInput,
    onTick: (
      status: 'running' | 'completed' | 'failed',
      url?: string,
      error?: string,
    ) => Promise<void>,
  ): Promise<{ status: 'completed' | 'failed'; url?: string; error?: string }> {
    const config = this.config.get<AppConfig>('app');
    let params;
    try {
      params = buildVideoParams({
        ...input,
        model: config.agnes.videoModel,
        secondsMin: config.video.secondsMin,
        secondsMax: config.video.secondsMax,
      });
    } catch (e: any) {
      await onTick('failed', undefined, e?.message || String(e));
      return { status: 'failed', error: e?.message || String(e) };
    }

    const created = await this.agnes.createVideoTask(params);
    if (created.error || !created.videoId) {
      const err = created.error || 'no video id';
      await onTick('failed', undefined, err);
      return { status: 'failed', error: err };
    }

    const start = Date.now();
    const deadline = start + this.pollTimeout();
    for (;;) {
      const poll = await this.agnes.pollVideoTask(created.videoId);
      if (poll.status === 'completed') {
        await onTick('completed', poll.url);
        return { status: 'completed', url: poll.url };
      }
      if (poll.status === 'failed') {
        await onTick('failed', undefined, poll.error);
        return { status: 'failed', error: poll.error };
      }
      // pending / running：超时保留 running 不误判，返回可再查
      if (Date.now() > deadline) {
        this.logger.warn(`video poll timeout for keyframe ${keyframeId}, keep running`);
        await onTick('running');
        return { status: 'failed', error: 'poll timeout (retry later)' };
      }
      await new Promise((r) => setTimeout(r, this.pollInterval()));
      await onTick('running');
    }
  }
}

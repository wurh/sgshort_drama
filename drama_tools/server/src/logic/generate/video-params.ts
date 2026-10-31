import { VideoParams } from './types';

/**
 * 构造 Agnes 视频任务参数（UT-BE-05）。
 * - mode='keyframe'：first_frame / last_frame 至少其一。
 * - size 默认 '720P'，仅接受 720P / 1080P（设计稿「输出设置」下拉）；
 *   其他值**回落默认**而不是抛错，避免前端传了不支持的值就整条任务失败。
 * - seconds 限制在 [secondsMin, secondsMax]（默认 4~12），越界抛错。
 * - Flash 专属约束：images<=5、audios<=3、禁止传 videos（否则 HTTP 400）。
 */
export interface BuildVideoInput {
  firstFrame?: string;
  lastFrame?: string;
  seconds?: number;
  images?: string[];
  audios?: string[];
  videos?: string[];
  model?: string;
  /** 输出分辨率：720p / 720P / 1080p / 1080P，缺省 720P。 */
  size?: string;
  secondsMin?: number;
  secondsMax?: number;
}

/** 支持的分辨率（大写规范化后比对）。 */
export const VIDEO_SIZES = ['720P', '1080P'] as const;
export const DEFAULT_VIDEO_SIZE = '720P';

/**
 * 归一化分辨率：大小写/带不带 P 都认，其它值回落默认。
 * 前端下拉给的是小写 720p/1080p，Agnes 要的是大写 720P，这里统一收口。
 */
export function normalizeVideoSize(raw?: string | null): string {
  if (!raw) return DEFAULT_VIDEO_SIZE;
  const up = String(raw).trim().toUpperCase();
  const withP = up.endsWith('P') ? up : `${up}P`;
  return (VIDEO_SIZES as readonly string[]).includes(withP) ? withP : DEFAULT_VIDEO_SIZE;
}

export function buildVideoParams(input: BuildVideoInput): VideoParams {
  const secondsMin = input.secondsMin ?? 4;
  const secondsMax = input.secondsMax ?? 12;
  const firstFrame = input.firstFrame || undefined;
  const lastFrame = input.lastFrame || undefined;
  if (!firstFrame && !lastFrame) {
    throw new Error('keyframe mode requires first_frame or last_frame');
  }
  const seconds = input.seconds ?? secondsMin;
  if (seconds < secondsMin || seconds > secondsMax) {
    throw new Error(`seconds ${seconds} out of range [${secondsMin}, ${secondsMax}]`);
  }
  const images = (input.images || []).slice(0, 5);
  const audios = (input.audios || []).slice(0, 3);
  if (input.videos && input.videos.length > 0) {
    // Flash 传 videos 会触发 400，后端一律禁用
    throw new Error('videos reference is disabled for agnes-video flash');
  }
  const params: VideoParams = {
    model: input.model || 'agnes-video-2.5-flash',
    mode: 'keyframe',
    size: normalizeVideoSize(input.size),
    first_frame: firstFrame,
    last_frame: lastFrame,
    seconds: String(seconds),
  };
  if (images.length) params.images = images;
  if (audios.length) params.audios = audios;
  return params;
}
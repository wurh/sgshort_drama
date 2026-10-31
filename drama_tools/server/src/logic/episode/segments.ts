import { randomUUID } from 'crypto';

/**
 * 片段内的「分镜」明细。
 *
 * 一个片段（keyframe 行）在业务上对应设计稿里的 "Segment N"，
 * 里面可以放多个分镜；每个分镜四要素对齐设计稿：
 *   景别 shot_size / 画面 visual / 运镜 camera / 声音 sound，外加 字幕/短句 caption。
 * 所有字段都用字符串而不是枚举，避免模型/用户输入把枚举写炸。
 */
export interface SegmentShot {
  id: string;
  /** 该分镜时长（秒），片段总时长 = 各分镜之和。 */
  seconds: number;
  shot_size: string;
  visual: string;
  camera: string;
  sound: string;
  caption: string;
}

/** 单张图的历史记录（重新生成后被替换掉的旧图留档，便于回滚参考）。 */
export interface ImageHistoryItem {
  kind: 'keyframe' | 'shot';
  url: string;
  ts: number;
}

export const MAX_HISTORY = 8;
export const DEFAULT_SHOT_SECONDS = 4;

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function num(v: unknown, fallback = DEFAULT_SHOT_SECONDS): number {
  const n = typeof v === 'number' ? v : Number(v);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : fallback;
}

/** 造一个分镜；缺字段一律给安全默认值，避免下游 undefined。 */
export function newShot(partial: Partial<SegmentShot> = {}): SegmentShot {
  return {
    id: partial.id || `shot-${randomUUID()}`,
    seconds: num(partial.seconds),
    shot_size: str(partial.shot_size),
    visual: str(partial.visual),
    camera: str(partial.camera),
    sound: str(partial.sound),
    caption: str(partial.caption),
  };
}

/** 老 JSON 缺字段时补齐（不改 id，保证前端引用稳定）。 */
export function normalizeShot(raw: unknown): SegmentShot {
  const o = (raw ?? {}) as Partial<SegmentShot>;
  return newShot({ ...o, id: typeof o.id === 'string' && o.id ? o.id : undefined });
}

export function parseShots(raw: string | null | undefined): SegmentShot[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.map(normalizeShot) : [];
  } catch {
    return [];
  }
}

export function stringifyShots(list: SegmentShot[]): string {
  return JSON.stringify(list);
}

export function shotsSeconds(list: SegmentShot[]): number {
  return list.reduce((s, x) => s + (Number(x.seconds) || 0), 0);
}

export function addShot(list: SegmentShot[], partial?: Partial<SegmentShot>): SegmentShot[] {
  return [...list, newShot(partial)];
}

export function patchShot(
  list: SegmentShot[],
  shotId: string,
  patch: Partial<SegmentShot>,
): SegmentShot[] {
  return list.map((s) =>
    s.id === shotId
      ? {
          ...s,
          // id 不允许被改成空值
          id: s.id,
          seconds: patch.seconds !== undefined ? num(patch.seconds, s.seconds) : s.seconds,
          shot_size: patch.shot_size !== undefined ? str(patch.shot_size) : s.shot_size,
          visual: patch.visual !== undefined ? str(patch.visual) : s.visual,
          camera: patch.camera !== undefined ? str(patch.camera) : s.camera,
          sound: patch.sound !== undefined ? str(patch.sound) : s.sound,
          caption: patch.caption !== undefined ? str(patch.caption) : s.caption,
        }
      : s,
  );
}

export function removeShot(list: SegmentShot[], shotId: string): SegmentShot[] {
  return list.filter((s) => s.id !== shotId);
}

export function parseHistory(raw: string | null | undefined): ImageHistoryItem[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    if (!Array.isArray(v)) return [];
    return v
      .filter((x) => x && typeof x.url === 'string' && x.url)
      .map((x) => ({
        kind: x.kind === 'shot' ? ('shot' as const) : ('keyframe' as const),
        url: x.url as string,
        ts: Number(x.ts) || 0,
      }));
  } catch {
    return [];
  }
}

export function stringifyHistory(list: ImageHistoryItem[]): string {
  return JSON.stringify(list);
}

/**
 * 把被替换掉的旧图压进历史记录。
 * - 同 url 不重复入栈（避免历史里一串一样的图）
 * - 最新在最前，最多 MAX_HISTORY 条
 */
export function pushHistory(
  list: ImageHistoryItem[],
  item: ImageHistoryItem,
): ImageHistoryItem[] {
  if (!item.url) return list;
  const rest = list.filter((x) => x.url !== item.url);
  return [item, ...rest].slice(0, MAX_HISTORY);
}

/**
 * 把连续的分镜按每组至多 maxPer 个切成片段。
 * 用于「生成分镜脚本」时把模型给的镜头列表归并成 Segment，
 * 避免一个镜头一个片段导致右侧两栏被撑成一长串。
 */
export function chunkShots<T>(list: T[], maxPer: number): T[][] {
  const size = Math.max(1, Math.floor(maxPer) || 1);
  const out: T[][] = [];
  for (let i = 0; i < list.length; i += size) {
    out.push(list.slice(i, i + size));
  }
  return out;
}
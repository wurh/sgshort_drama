/**
 * 资产「形象」（variant）领域模型（纯函数，便于单测）。
 *
 * 设计要点：
 * - 一个资产（角色/场景/道具）可拥有多个形象。第 1 个为「基础形象」，
 *   其余由用户从素材库添加或由 AI 生成新形象（对应详情页顶部的形象 Tab）。
 * - 每个形象有两张图：portrait（竖版立绘，中栏）+ sheet（四视图，右栏）。
 *   四视图可以是生成结果，也可以是由 portrait 合成（V1 用生成结果）。
 * - 图片组（gallery）承载「已添加形象 4/4」里的多张缩略图。
 */
import { randomUUID } from 'crypto';

export type VariantKind = 'base' | 'custom';
export type VariantStatus = 'pending' | 'generating' | 'done' | 'failed';

export interface AssetVariant {
  /** 稳定 id（uuid），前端 tab / 请求都用它。 */
  id: string;
  /** 形象名称，如「基础形象」「旧校服」。 */
  name: string;
  /** 用户可编辑的形象描述（空则回退到资产 desc）。 */
  desc: string;
  /** 风格库 key（styles.ts），空表示继承项目风格。 */
  style_key: string | null;
  /** 生图模型名，便于回溯当时用的是哪个模型。 */
  model: string | null;
  /** 竖版立绘 url。 */
  portrait_url: string | null;
  /** 四视图（正/侧/背 全身）url。 */
  sheet_url: string | null;
  /** 多视图/素材图组。 */
  gallery: string[];
  /** 是否应用到所有形象（详情页左侧勾选项）。 */
  apply_to_all: boolean;
  kind: VariantKind;
  status: VariantStatus;
  error: string | null;
  cost_ms: number | null;
  created_at: number;
}

export const MAX_GALLERY = 4;

/** 解析 variants JSON 列，容错到空数组。 */
export function parseVariants(raw: string | null | undefined): AssetVariant[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    if (!Array.isArray(v)) return [];
    return v.filter((x) => x && typeof x === 'object' && typeof x.id === 'string');
  } catch {
    return [];
  }
}

/** 序列化为 JSON 列。 */
export function stringifyVariants(list: AssetVariant[]): string {
  return JSON.stringify(list);
}

/**
 * 老数据兜底的基础形象 id：由资产 id 推导，**必须确定性**。
 *
 * 坑：早期实现用 randomUUID()，而老资产的 variants 列是 NULL，
 * 于是每次 GET 都现场造一个新 id —— 前端拿到的 id 和下一次
 * POST（保存/切风格/生成）时后端重新造出来的 id 永远对不上，
 * 表现为「点按钮/切风格就报 variant xxx not found」。
 * 这里改成稳定 id，读写两侧在任何一次请求里都能对上。
 */
export function stableBaseVariantId(assetId: number | string): string {
  return `asset-${assetId}-base`;
}

/**
 * 归一化：保证至少有一个「基础形象」。
 * 老数据（只有 base_image_url 没有 variants）也要能平滑升级——
 * 用 base_image_url 兜出一个基础形象，避免前端空态。
 *
 * 已有形象列表时也会逐条补齐缺省字段 + 回填图组，
 * 保证「读到的形状」与「写回去的形状」一致（否则每次读都像变了，白写库）。
 *
 * @param assetId 资产 id，用于生成确定性的基础形象 id（不传则退化为随机，仅测试用）
 */
export function ensureBaseVariant(
  list: AssetVariant[],
  baseImageUrl: string | null,
  model?: string | null,
  assetId?: number | string,
): AssetVariant[] {
  if (list.length > 0) {
    const normalized = list.map(normalizeVariant);
    // 已经是规范形状时返回原数组，保持「幂等」语义（调用方常拿它做相等判断）
    const same = (a: AssetVariant, b: AssetVariant) => JSON.stringify(a) === JSON.stringify(b);
    return normalized.every((v, i) => same(v, list[i])) ? list : normalized;
  }
  const id = assetId === undefined ? undefined : stableBaseVariantId(assetId);
  return [
    newVariant({
      id,
      name: '基础形象',
      kind: 'base',
      model,
      portrait_url: baseImageUrl ?? null,
      status: baseImageUrl ? 'done' : 'pending',
    }),
  ];
}

/** 老 JSON 可能缺 kind/gallery 等字段，补齐默认值，避免下游拿到 undefined 崩掉。 */
export function normalizeVariant(raw: AssetVariant): AssetVariant {
  return newVariant({ ...raw, id: raw.id });
}

/**
 * 图组兜底：形象已经有立绘/四视图（或历史 extra_images），但图组还是空的时候把图补进去。
 *
 * 坑：早期只在用户点「+」时才往 gallery 写图，导致「生成完了却没有形象」——
 * 列表卡片的「已添加形象 n/4」永远是 0，缩略图全空。这里按
 * 「立绘 → 四视图 → 历史追加图」顺序补齐，且只在图组为空时补，
 * 不动用户自己整理的顺序。
 */
export function backfillGallery(v: AssetVariant, extra: string[] = []): AssetVariant {
  if (v.gallery.length > 0) return v;
  const seeds = [v.portrait_url, v.sheet_url, ...extra].filter(
    (u): u is string => Boolean(u),
  );
  if (seeds.length === 0) return v;
  return { ...v, gallery: Array.from(new Set(seeds)).slice(0, MAX_GALLERY) };
}

/** 该形象是否需要补图组（用于读路径决定是否要落库，避免无谓写）。 */
export function needsGalleryBackfill(list: AssetVariant[]): boolean {
  return list.some((v) => v.gallery.length === 0 && Boolean(v.portrait_url || v.sheet_url));
}

/**
 * 按资产类型清洗形象数据。
 *
 * 「四视图（sheet）」是角色专用产物：场景/道具页只有一张横版成品图。
 * 早期误用同一套生成链路，导致场景的图组里混进一张白底角色设定图，
 * 详情页底部的缩略图行就会在场景图旁边出现一张毫不相干的立绘。
 * 这里在读出时把它清掉（含 gallery 里的同一张），避免脏数据外露。
 */
export function sanitizeVariantForType(v: AssetVariant, type: string): AssetVariant {
  if (type === 'character') return v;
  const gallery = v.gallery.filter((u) => u && u !== v.sheet_url);
  if (v.sheet_url === null && gallery.length === v.gallery.length) return v;
  return { ...v, sheet_url: null, gallery };
}

/**
 * 生成（或覆盖）一张图后把它收进图组：
 * - 同类旧图（previous）被原位替换，避免重新生成后图组里还是旧脸；
 * - 不替换时追加到末尾；
 * - 组内最多 MAX_GALLERY 张，超出丢最旧。
 */
export function collectImage(
  gallery: string[],
  url: string,
  previous?: string | null,
): string[] {
  const base = gallery.filter((u) => u && u !== url);
  const at = previous ? base.indexOf(previous) : -1;
  const next = at >= 0
    ? base.map((u, i) => (i === at ? url : u))
    : [...base, url];
  return next.slice(-MAX_GALLERY);
}

export function newVariant(
  input: Partial<AssetVariant> & { name?: string } = {},
): AssetVariant {
  return {
    id: input.id ?? randomUUID(),
    name: input.name?.trim() || '基础形象',
    desc: input.desc ?? '',
    style_key: input.style_key ?? null,
    model: input.model ?? null,
    portrait_url: input.portrait_url ?? null,
    sheet_url: input.sheet_url ?? null,
    gallery: Array.isArray(input.gallery) ? input.gallery.filter(Boolean) : [],
    apply_to_all: input.apply_to_all ?? false,
    kind: input.kind ?? 'custom',
    status: input.status ?? 'pending',
    error: input.error ?? null,
    cost_ms: input.cost_ms ?? null,
    created_at: input.created_at ?? Date.now(),
  };
}

/** 追加图片到 gallery，超过 MAX_GALLERY 时丢弃最旧的（对齐「已添加形象 4/4」上限）。 */
export function pushGallery(variant: AssetVariant, urls: string[]): AssetVariant {
  const next = [...variant.gallery, ...urls.filter(Boolean)];
  return { ...variant, gallery: next.slice(-MAX_GALLERY) };
}

/** 更新某个形象；找不到返回 null。 */
export function patchVariant(
  list: AssetVariant[],
  id: string,
  patch: Partial<AssetVariant>,
): { list: AssetVariant[]; updated: AssetVariant | null } {
  let updated: AssetVariant | null = null;
  const next = list.map((v) => {
    if (v.id !== id) return v;
    updated = { ...v, ...patch, id: v.id };
    return updated;
  });
  return { list: next, updated };
}

/** 删除形象；基础形象不可删除（返回原列表 + false）。 */
export function removeVariant(
  list: AssetVariant[],
  id: string,
): { list: AssetVariant[]; removed: boolean } {
  const target = list.find((v) => v.id === id);
  if (!target || target.kind === 'base') return { list, removed: false };
  return { list: list.filter((v) => v.id !== id), removed: true };
}

/**
 * 「已添加形象 n/m」文案口径：gallery 数量 / 上限。
 * 详情页右侧与列表卡片都用这个口径，保证两处数字一致。
 */
export function galleryStat(v: AssetVariant): { used: number; max: number } {
  return { used: v.gallery.length, max: MAX_GALLERY };
}
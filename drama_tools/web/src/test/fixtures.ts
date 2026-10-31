import type {
  AssetView,
  AssetVariant,
  EpisodeStats,
  EpisodeDetail,
  KeyframeView,
  SegmentShot,
} from '@/shared/types';

/**
 * 测试用资产工厂：集中维护 AssetView 形状，
 * 避免每处 fixture 手写字段（曾因新增 variants 列导致多处测试类型报错）。
 */
export function makeVariant(over: Partial<AssetVariant> = {}): AssetVariant {
  return {
    id: over.id ?? 'v-base',
    name: over.name ?? '基础形象',
    desc: over.desc ?? '',
    style_key: over.style_key ?? null,
    model: over.model ?? null,
    portrait_url: over.portrait_url ?? null,
    sheet_url: over.sheet_url ?? null,
    gallery: over.gallery ?? [],
    apply_to_all: over.apply_to_all ?? false,
    kind: over.kind ?? 'base',
    status: over.status ?? 'pending',
    error: over.error ?? null,
    cost_ms: over.cost_ms ?? null,
    created_at: over.created_at ?? 0,
  };
}

export function makeAsset(over: Partial<AssetView> = {}): AssetView {
  const variants = over.variants ?? [makeVariant()];
  return {
    id: over.id ?? 1,
    project_id: over.project_id ?? 3,
    type: over.type ?? 'character',
    name: over.name ?? '林远',
    desc: over.desc ?? null,
    base_image_url: over.base_image_url ?? null,
    extra_images: over.extra_images ?? [],
    status: over.status ?? 'pending',
    sync_enabled: over.sync_enabled ?? true,
    auto_sync: over.auto_sync ?? false,
    cost_ms: over.cost_ms ?? null,
    error: over.error ?? null,
    image_count: over.image_count ?? 0,
    variants,
    variant_names: over.variant_names ?? variants.map((v) => v.name),
  };
}
/** 测试用分镜工厂。 */
export function makeShot(over: Partial<SegmentShot> = {}): SegmentShot {
  return {
    id: over.id ?? 'shot-1',
    seconds: over.seconds ?? 4,
    shot_size: over.shot_size ?? '',
    visual: over.visual ?? '',
    camera: over.camera ?? '',
    sound: over.sound ?? '',
    caption: over.caption ?? '',
  };
}

/** 测试用片段（Segment）工厂：shots 缺省给 1 个分镜，保证中栏不会渲染空卡片。 */
export function makeSegment(over: Partial<KeyframeView> = {}): KeyframeView {
  const shots = over.shots ?? [makeShot()];
  return {
    id: over.id ?? 1,
    episode_id: over.episode_id ?? 1,
    seq: over.seq ?? 1,
    shot_type: over.shot_type ?? null,
    camera: over.camera ?? null,
    seconds: over.seconds ?? shots.reduce((s, x) => s + x.seconds, 0),
    visual_desc: over.visual_desc ?? null,
    dialogue: over.dialogue ?? null,
    scene_setting: over.scene_setting ?? null,
    shots,
    shot_count: over.shot_count ?? shots.length,
    character_refs: over.character_refs ?? [],
    scene_refs: over.scene_refs ?? [],
    prop_refs: over.prop_refs ?? [],
    keyframe_url: over.keyframe_url ?? null,
    shot_image_url: over.shot_image_url ?? null,
    history: over.history ?? [],
    video_url: over.video_url ?? null,
    video_status: over.video_status ?? 'pending',
    error: over.error ?? null,
  };
}

/** 测试用分集卡片统计工厂。 */
export function makeEpisodeStats(over: Partial<EpisodeStats> = {}): EpisodeStats {
  return {
    episode_id: over.episode_id ?? 1,
    seq: over.seq ?? 1,
    title: over.title ?? '第1集：街头挑衅',
    status: over.status ?? 'draft',
    character_count: over.character_count ?? 2,
    scene_count: over.scene_count ?? 1,
    keyframe_count: over.keyframe_count ?? 2,
    shot_count: over.shot_count ?? 4,
    total_seconds: over.total_seconds ?? 92,
    cover_url: over.cover_url ?? null,
    video_url: over.video_url ?? null,
    image_done: over.image_done ?? 0,
  };
}

/** 测试用分集详情工厂。 */
export function makeEpisodeDetail(over: Partial<EpisodeDetail> = {}): EpisodeDetail {
  return {
    episode_id: over.episode_id ?? 1,
    project_id: over.project_id ?? 3,
    seq: over.seq ?? 1,
    title: over.title ?? '第1集：街头挑衅',
    summary: over.summary ?? '',
    seconds: over.seconds ?? 90,
    status: over.status ?? 'draft',
    segment_count: over.segment_count ?? 2,
    shot_count: over.shot_count ?? 4,
    total_seconds: over.total_seconds ?? 92,
    video_url: over.video_url ?? null,
    video_status: over.video_status ?? 'pending',
  };
}

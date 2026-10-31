/** 后端统一响应信封。 */
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

/** 剧集（项目管理）。 */
export interface ProjectView {
  id: number;
  title: string;
  creative: string | null;
  style: string | null;
  episode_count: number;
  target_seconds: number;
  status: string;
  cover_url: string | null;
  episode_count_actual: number;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectPayload {
  creative: string;
  style?: string;
  episode_count?: number;
  target_seconds?: number;
  title?: string;
}

/** 剧本大纲。 */
export interface OutlineEpisode {
  title: string;
  summary: string;
  seconds: number;
  characters: string[];
  scenes: string[];
}
export interface OutlineResult {
  episodes: OutlineEpisode[];
  characters: { name: string; desc: string; tags?: string[] }[];
  scenes: { name: string; desc: string }[];
  props: { name: string; desc: string }[];
}
export interface OutlineView {
  id: number;
  project_id: number;
  version: number;
  episodes: OutlineEpisode[];
  characters: OutlineResult['characters'];
  scenes: OutlineResult['scenes'];
  props: OutlineResult['props'];
  status: string;
}

/** 资产「形象」：一个资产可有多个形象（基础形象 / 旧校服 / 少年…）。 */
export interface AssetVariant {
  id: string;
  name: string;
  desc: string;
  style_key: string | null;
  model: string | null;
  /** 竖版立绘（详情页中栏）。 */
  portrait_url: string | null;
  /** 四视图（详情页右栏）。 */
  sheet_url: string | null;
  /** 图组缩略图，上限 4。 */
  gallery: string[];
  apply_to_all: boolean;
  kind: 'base' | 'custom';
  status: 'pending' | 'generating' | 'done' | 'failed';
  error: string | null;
  cost_ms: number | null;
  created_at: number;
}

/** 风格库条目。 */
export interface StyleItem {
  key: string;
  label: string;
  category: '2d' | '3d' | 'real';
  name: string;
  prompt: string;
  tint: string;
}

/** 资产库。 */
export interface AssetView {
  id: number;
  project_id: number;
  type: 'character' | 'scene' | 'prop';
  name: string;
  desc: string | null;
  base_image_url: string | null;
  extra_images: string[];
  status: 'pending' | 'generating' | 'done' | 'failed';
  sync_enabled: boolean;
  auto_sync: boolean;
  cost_ms: number | null;
  error: string | null;
  image_count: number;
  /** 形象列表（至少 1 个）。 */
  variants: AssetVariant[];
  /** 形象 Tab 的短标签。 */
  variant_names: string[];
}

/** 分集卡片统计。 */
export interface EpisodeStats {
  episode_id: number;
  seq: number;
  title: string | null;
  status: string;
  character_count: number;
  scene_count: number;
  /** 片段（Segment）数。 */
  keyframe_count: number;
  /** 分镜（片段内镜头）总数。 */
  shot_count: number;
  total_seconds: number;
  /** 封面图：优先首个已出图片段。 */
  cover_url: string | null;
  /** 成片 url（已拼接完成时）。 */
  video_url: string | null;
  /** 已出图片段数，用于卡片「生成中」判定。 */
  image_done: number;
}

/** 单集详情。 */
export interface EpisodeDetail {
  episode_id: number;
  project_id: number;
  seq: number;
  title: string | null;
  summary: string | null;
  seconds: number;
  status: string;
  segment_count: number;
  shot_count: number;
  total_seconds: number;
  video_url: string | null;
  video_status: string;
}

/** 片段内的一个分镜。 */
export interface SegmentShot {
  id: string;
  seconds: number;
  shot_size: string;
  visual: string;
  camera: string;
  sound: string;
  caption: string;
}

/** 关键帧 / 分镜画面的历史图。 */
export interface ImageHistoryItem {
  kind: 'keyframe' | 'shot';
  url: string;
  ts: number;
}

/** 镜头 / 关键帧（业务上是一个「片段 Segment」）。 */
export interface KeyframeView {
  id: number;
  episode_id: number;
  seq: number;
  shot_type: string | null;
  camera: string | null;
  seconds: number;
  visual_desc: string | null;
  dialogue: string | null;
  scene_setting: string | null;
  /** 片段内的分镜列表（至少 1 个）。 */
  shots: SegmentShot[];
  shot_count: number;
  character_refs: number[];
  scene_refs: number[];
  prop_refs: number[];
  keyframe_url: string | null;
  shot_image_url: string | null;
  history: ImageHistoryItem[];
  video_url: string | null;
  video_status: 'pending' | 'running' | 'completed' | 'failed';
  error: string | null;
}

/** 后端 SSE 事件（对应 server GenEvent）。 */
export interface GenEvent {
  projectId: number;
  type:
    | 'info'
    | 'progress'
    | 'outline'
    | 'asset'
    | 'keyframe'
    | 'image'
    | 'video'
    | 'splice'
    | 'download'
    | 'think'
    | 'tool'
    | 'done';
  message: string;
  percent?: number;
  refId?: number;
  outUrl?: string;
  stage?: string;
  ts: number;
}

/** 视频进度。 */
export interface VideoProgress {
  total: number;
  completed: number;
  failed: number;
  running: number;
  all_done: boolean;
  all_completed: boolean;
}

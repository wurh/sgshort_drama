import { apiClient, unwrap, getApiBaseURL } from './apiClient';
import type {
  ProjectView,
  CreateProjectPayload,
  OutlineView,
  OutlineResult,
  AssetView,
  StyleItem,
  EpisodeStats,
  EpisodeDetail,
  SegmentShot,
  KeyframeView,
  VideoProgress,
} from '@/shared/types';

// ---------- 项目管理 ----------
export const listProjects = () =>
  unwrap<ProjectView[]>(apiClient.get('/projects'));
export const getProject = (id: number) =>
  unwrap<ProjectView>(apiClient.get(`/projects/${id}`));
export const createProject = (p: CreateProjectPayload) =>
  unwrap<ProjectView>(apiClient.post('/projects', p));
export const deleteProject = (id: number) =>
  unwrap<{ deleted: boolean }>(apiClient.delete(`/projects/${id}`));

// ---------- 剧本大纲（步骤 1） ----------
export const getOutline = (pid: number) =>
  unwrap<OutlineView | null>(apiClient.get(`/projects/${pid}/outline`));
export const generateOutline = (pid: number) =>
  unwrap<OutlineView>(apiClient.post(`/projects/${pid}/outline/generate`));
export const saveOutline = (pid: number, payload: OutlineResult) =>
  unwrap<OutlineView>(apiClient.post(`/projects/${pid}/outline/save`, payload));

// ---------- 资产库（步骤 2） ----------
export const listAssets = (pid: number, type?: string) =>
  unwrap<AssetView[]>(apiClient.get(`/projects/${pid}/assets`, { params: { type } }));
export const getAsset = (pid: number, assetId: number) =>
  unwrap<AssetView>(apiClient.get(`/projects/${pid}/assets/${assetId}`));
export const listStyles = (category?: string) =>
  unwrap<StyleItem[]>(apiClient.get('/styles', { params: { category } }));
export const createAsset = (
  pid: number,
  d: { type: string; name: string; desc?: string; style_key?: string },
) => unwrap<AssetView>(apiClient.post(`/projects/${pid}/assets`, d));
export const generateAssetBase = (pid: number, assetId: number) =>
  unwrap<AssetView>(apiClient.post(`/projects/${pid}/assets/${assetId}/base`));
export const batchAssetBase = (pid: number, type?: string) =>
  unwrap<{ total: number; done: number; failed: number }>(
    apiClient.post(`/projects/${pid}/assets/batch-base`, { type }),
  );
/** 顶部「同步资产 / 自动同步」批量开关。 */
export const setProjectAssetsSync = (
  pid: number,
  payload: { sync_enabled?: boolean; auto_sync?: boolean },
) => unwrap<{ updated: number }>(apiClient.post(`/projects/${pid}/assets/sync`, payload));

// ---------- 形象（variant） ----------
export const createAssetVariant = (
  pid: number,
  assetId: number,
  d: { name?: string; desc?: string; style_key?: string },
) => unwrap<AssetView>(apiClient.post(`/projects/${pid}/assets/${assetId}/variants`, d));
export const updateAssetVariant = (
  pid: number,
  assetId: number,
  variantId: string,
  d: { name?: string; desc?: string; style_key?: string | null; apply_to_all?: boolean },
) =>
  unwrap<AssetView>(
    apiClient.post(`/projects/${pid}/assets/${assetId}/variants/${variantId}`, d),
  );
export const deleteAssetVariant = (pid: number, assetId: number, variantId: string) =>
  unwrap<AssetView>(
    apiClient.delete(`/projects/${pid}/assets/${assetId}/variants/${variantId}`),
  );
export const generateVariantImage = (
  pid: number,
  assetId: number,
  variantId: string,
  kind: 'portrait' | 'sheet',
  ratio?: string,
) =>
  unwrap<AssetView>(
    apiClient.post(`/projects/${pid}/assets/${assetId}/variants/${variantId}/image/${kind}`, {
      ratio,
    }),
  );
export const addVariantGallery = (pid: number, assetId: number, variantId: string, url: string) =>
  unwrap<AssetView>(
    apiClient.post(`/projects/${pid}/assets/${assetId}/variants/${variantId}/gallery`, { url }),
  );
export const addAssetImage = (pid: number, assetId: number, url?: string) =>
  unwrap<AssetView>(apiClient.post(`/projects/${pid}/assets/${assetId}/add-image`, { url }));
export const toggleAssetSync = (pid: number, assetId: number, sync: boolean, auto?: boolean) =>
  unwrap<AssetView>(apiClient.post(`/projects/${pid}/assets/${assetId}/sync`, { sync, auto }));
export const deleteAsset = (pid: number, assetId: number) =>
  unwrap<{ deleted: boolean }>(apiClient.delete(`/projects/${pid}/assets/${assetId}`));

// ---------- 分集视频（步骤 3） ----------
export const listEpisodes = (pid: number) =>
  unwrap<EpisodeStats[]>(apiClient.get(`/projects/${pid}/episodes`));
export const getEpisode = (pid: number, epId: number) =>
  unwrap<EpisodeDetail>(apiClient.get(`/projects/${pid}/episodes/${epId}`));
export const createEpisode = (
  pid: number,
  d: { title?: string; summary?: string; seconds?: number } = {},
) => unwrap<EpisodeDetail>(apiClient.post(`/projects/${pid}/episodes`, d));
export const deleteEpisode = (pid: number, epId: number) =>
  unwrap<{ deleted: boolean }>(apiClient.delete(`/projects/${pid}/episodes/${epId}`));
export const generateScript = (pid: number, epId: number, shot_count?: number) =>
  unwrap<{ keyframes: number; shots: number }>(
    apiClient.post(`/projects/${pid}/episodes/${epId}/script`, { shot_count }),
  );
export const listKeyframes = (pid: number, epId: number) =>
  unwrap<KeyframeView[]>(apiClient.get(`/projects/${pid}/episodes/${epId}/keyframes`));
export const addKeyframe = (
  pid: number,
  epId: number,
  d: {
    visual_desc?: string;
    dialogue?: string;
    seq?: number;
    scene_setting?: string;
    after_keyframe_id?: number;
  } = {},
) => unwrap<KeyframeView>(apiClient.post(`/projects/${pid}/episodes/${epId}/keyframes`, d));
export const editKeyframe = (pid: number, epId: number, kfId: number, d: Partial<KeyframeView>) =>
  unwrap<KeyframeView>(
    apiClient.post(`/projects/${pid}/episodes/${epId}/keyframes/${kfId}`, d),
  );
export const editSegment = (
  pid: number,
  epId: number,
  kfId: number,
  d: { scene_setting?: string; visual_desc?: string; shots?: Partial<SegmentShot>[] },
) =>
  unwrap<KeyframeView>(
    apiClient.post(`/projects/${pid}/episodes/${epId}/keyframes/${kfId}/segment`, d),
  );
export const reorderSegments = (pid: number, epId: number, keyframe_ids: number[]) =>
  unwrap<KeyframeView[]>(
    apiClient.post(`/projects/${pid}/episodes/${epId}/keyframes/reorder`, { keyframe_ids }),
  );
export const addShot = (pid: number, epId: number, kfId: number, shot: Partial<SegmentShot> = {}) =>
  unwrap<KeyframeView>(
    apiClient.post(`/projects/${pid}/episodes/${epId}/keyframes/${kfId}/shots`, { shot }),
  );
export const editShot = (
  pid: number,
  epId: number,
  kfId: number,
  shotId: string,
  d: Partial<SegmentShot>,
) =>
  unwrap<KeyframeView>(
    apiClient.post(`/projects/${pid}/episodes/${epId}/keyframes/${kfId}/shots/${shotId}`, d),
  );
export const deleteShot = (pid: number, epId: number, kfId: number, shotId: string) =>
  unwrap<KeyframeView>(
    apiClient.delete(`/projects/${pid}/episodes/${epId}/keyframes/${kfId}/shots/${shotId}`),
  );
export const moveKeyframe = (pid: number, epId: number, kfId: number, seq: number) =>
  unwrap<KeyframeView>(
    apiClient.post(`/projects/${pid}/episodes/${epId}/keyframes/${kfId}/move`, { seq }),
  );
export const deleteKeyframe = (pid: number, epId: number, kfId: number) =>
  unwrap<{ deleted: boolean }>(
    apiClient.delete(`/projects/${pid}/episodes/${epId}/keyframes/${kfId}`),
  );
export interface GenerateOptions {
  /** 输出分辨率：出图 1K/2K/4K，视频 720p/1080p。 */
  size?: string;
  /** 风格提示词（风格库选中项透传）。 */
  style_prompt?: string;
  /** 参考图 URL（覆盖按资产自动挑选）。 */
  ref_images?: string[];
}

export const genKeyframeImage = (
  pid: number,
  epId: number,
  kfId: number,
  kind: 'keyframe' | 'shot',
  opts: GenerateOptions = {},
) =>
  unwrap<KeyframeView>(
    apiClient.post(`/projects/${pid}/episodes/${epId}/keyframes/${kfId}/image/${kind}`, opts),
  );
/** 单镜头生成视频（生成视频面板提交）。 */
export const genKeyframeVideo = (
  pid: number,
  epId: number,
  kfId: number,
  opts: GenerateOptions & { seconds?: number } = {},
) =>
  unwrap<{ keyframeId: number; videoStatus: string; reused: boolean }>(
    apiClient.post(`/projects/${pid}/episodes/${epId}/keyframes/${kfId}/video`, opts),
  );
export const batchImages = (pid: number, epId: number, kind: 'keyframe' | 'shot') =>
  unwrap<{ processed: number }>(
    apiClient.post(`/projects/${pid}/episodes/${epId}/batch-images/${kind}`),
  );
export const batchVideos = (pid: number, epId: number, seconds?: number) =>
  unwrap<{ submitted: number }>(
    apiClient.post(`/projects/${pid}/episodes/${epId}/batch-video`, { seconds }),
  );
export const videoProgress = (pid: number, epId: number) =>
  unwrap<VideoProgress>(apiClient.get(`/projects/${pid}/episodes/${epId}/video-progress`));
export const assembleEpisode = (pid: number, epId: number) =>
  unwrap<{ status: string; url: string | null; total_seconds?: number }>(
    apiClient.post(`/projects/${pid}/episodes/${epId}/assemble`),
  );
export const batchDownload = (pid: number, epId: number, kind: 'image' | 'video' | 'episode') =>
  unwrap<unknown>(apiClient.post(`/projects/${pid}/episodes/${epId}/download`, { kind }));

// ---------- SSE 过程流（复用 sghouse 契约） ----------
export function openProjectEventStream(pid: number): EventSource {
  // 统一走 getApiBaseURL()，与 axios 的 baseURL 保持同一份来源，避免两处地址漂移。
  return new EventSource(`${getApiBaseURL()}/projects/${pid}/events`);
}
export function parseGenEvent(raw: string): import('@/shared/types').GenEvent | null {
  try {
    return JSON.parse(raw) as import('@/shared/types').GenEvent;
  } catch {
    return null;
  }
}

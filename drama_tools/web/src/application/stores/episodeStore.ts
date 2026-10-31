import { create } from 'zustand';
import type { KeyframeView, VideoProgress } from '@/shared/types';

/**
 * 分集视频状态：镜头列表 + 视频进度 + 成片。
 * UT-FE-02 pushVideoStatus / UT-FE-03 useVideoPoll 配合。
 */
interface EpisodeState {
  episodeId: number | null;
  keyframes: KeyframeView[];
  videoProgress: VideoProgress | null;
  episodeVideo: { status: string; url: string | null } | null;
  /** "生成最终视频"按钮可用：全部镜头 completed。 */
  canAssemble: boolean;
  setEpisode: (id: number) => void;
  setKeyframes: (kfs: KeyframeView[]) => void;
  setVideoProgress: (p: VideoProgress | null) => void;
  setEpisodeVideo: (v: { status: string; url: string | null } | null) => void;
}

export const useEpisodeStore = create<EpisodeState>((set) => ({
  episodeId: null,
  keyframes: [],
  videoProgress: null,
  episodeVideo: null,
  canAssemble: false,
  setEpisode: (id) =>
    set({ episodeId: id, keyframes: [], videoProgress: null, episodeVideo: null, canAssemble: false }),
  setKeyframes: (kfs) => set({ keyframes: kfs }),
  setVideoProgress: (p) => set({ videoProgress: p, canAssemble: !!p?.all_completed }),
  setEpisodeVideo: (v) => set({ episodeVideo: v }),
}));

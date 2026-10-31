import { describe, it, expect, beforeEach } from 'vitest';
import { useEpisodeStore } from '@/application/stores/episodeStore';
import type { KeyframeView, VideoProgress } from '@/shared/types';

/** UT-FE-02 episodeStore：全 completed → "生成最终视频" 可用；单 failed 可重做且其他保留。 */
describe('useEpisodeStore', () => {
  beforeEach(() => useEpisodeStore.getState().setEpisode(0));

  const kf = (id: number, status: KeyframeView['video_status']): KeyframeView => ({
    id,
    episode_id: 1,
    seq: id,
    shot_type: '',
    camera: '',
    seconds: 8,
    visual_desc: '',
    dialogue: '',
    scene_setting: null,
    shots: [
      {
        id: `s${id}`,
        seconds: 8,
        shot_size: '',
        visual: '',
        camera: '',
        sound: '',
        caption: '',
      },
    ],
    shot_count: 1,
    character_refs: [],
    scene_refs: [],
    prop_refs: [],
    keyframe_url: null,
    shot_image_url: null,
    history: [],
    video_url: null,
    video_status: status,
    error: null,
  });

  const vp = (completed: number, total: number, failed = 0): VideoProgress => ({
    total,
    completed,
    failed,
    running: total - completed - failed,
    all_done: total > 0 && completed + failed === total,
    all_completed: total > 0 && completed === total,
  });

  it('全镜头 completed → canAssemble 为 true', () => {
    useEpisodeStore.getState().setKeyframes([kf(1, 'completed'), kf(2, 'completed')]);
    useEpisodeStore.getState().setVideoProgress(vp(2, 2));
    expect(useEpisodeStore.getState().canAssemble).toBe(true);
  });

  it('单镜头 failed 时 canAssemble 为 false，其余 completed 保留', () => {
    useEpisodeStore.getState().setKeyframes([kf(1, 'completed'), kf(2, 'failed')]);
    useEpisodeStore.getState().setVideoProgress(vp(1, 2, 1));
    const s = useEpisodeStore.getState();
    expect(s.canAssemble).toBe(false);
    expect(s.keyframes[0].video_status).toBe('completed');
    expect(s.keyframes[1].video_status).toBe('failed');
  });

  it('setEpisode 重置全部', () => {
    useEpisodeStore.getState().setVideoProgress(vp(1, 1));
    useEpisodeStore.getState().setEpisode(9);
    const s = useEpisodeStore.getState();
    expect(s.episodeId).toBe(9);
    expect(s.canAssemble).toBe(false);
    expect(s.videoProgress).toBeNull();
  });
});

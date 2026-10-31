import { useEffect, useRef } from 'react';
import { useEpisodeStore } from '../stores/episodeStore';
import { videoProgress } from '@/infrastructure/api/dramaApi';

/**
 * 轮询视频任务进度（复刻 sghouse usePollProgress，UT-FE-03）：
 * - 1~2s 拉 keyframe.video_status。
 * - 全部 completed 后停止轮询并触发 onAllCompleted（一次）。
 * - all_done（含 failed）也停止，避免死转。
 */
export function useVideoPoll(
  projectId: number | null,
  episodeId: number | null,
  intervalMs = 2000,
  onAllCompleted?: () => void,
) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopped = useRef(false);
  const fired = useRef(false);
  const cb = useRef(onAllCompleted);
  cb.current = onAllCompleted;

  useEffect(() => {
    if (projectId == null || episodeId == null) return;
    stopped.current = false;
    fired.current = false;

    const tick = async () => {
      if (stopped.current) return;
      try {
        const p = await videoProgress(projectId, episodeId);
        if (stopped.current) return;
        useEpisodeStore.getState().setVideoProgress(p);
        if (p.all_completed && !fired.current) {
          fired.current = true;
          cb.current?.();
          return; // 停止轮询
        }
        if (p.all_done) return; // 全终态（含失败）停止
        timer.current = setTimeout(tick, intervalMs);
      } catch {
        // 轮询失败：加倍间隔重试，不崩
        if (!stopped.current) timer.current = setTimeout(tick, intervalMs * 2);
      }
    };

    tick();
    return () => {
      stopped.current = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, [projectId, episodeId, intervalMs]);
}

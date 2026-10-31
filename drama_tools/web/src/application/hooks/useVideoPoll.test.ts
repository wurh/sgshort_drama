import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useVideoPoll } from '@/application/hooks/useVideoPoll';
import { videoProgress } from '@/infrastructure/api/dramaApi';

vi.mock('@/infrastructure/api/dramaApi', async () => {
  const actual = await import('@/infrastructure/api/dramaApi');
  return { ...actual, videoProgress: vi.fn() };
});

/** UT-FE-03 useVideoPoll：running→completed 轮询停止，终态回调只调一次。 */
describe('useVideoPoll', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.resetAllMocks();
  });

  it('从 running 轮询到 completed 后停止，终态回调只调一次', async () => {
    let calls = 0;
    vi.mocked(videoProgress).mockImplementation(async () => {
      calls++;
      if (calls < 3) {
        return { total: 4, completed: calls - 1, failed: 0, running: 5 - calls, all_done: false, all_completed: false };
      }
      return { total: 4, completed: 4, failed: 0, running: 0, all_done: true, all_completed: true };
    });
    const onDone = vi.fn();

    renderHook(() => useVideoPoll(1, 2, 1000, onDone));

    // 手动推进：首 tick 立即执行，之后每次 +1000ms 触发下一 tick（全 fake timers）
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(1000);
    await vi.advanceTimersByTimeAsync(1000);
    expect(calls).toBeGreaterThanOrEqual(3);
    expect(onDone).toHaveBeenCalledTimes(1);

    // 全完成后停止轮询：再推进若干周期不再新增调用
    const finalCalls = calls;
    await vi.advanceTimersByTimeAsync(5000);
    expect(calls).toBe(finalCalls);
  });

  it('无效 projectId/episodeId 不轮询', () => {
    renderHook(() => useVideoPoll(null, 1));
    expect(vi.mocked(videoProgress)).not.toHaveBeenCalled();
    renderHook(() => useVideoPoll(1, null));
    expect(vi.mocked(videoProgress)).not.toHaveBeenCalled();
  });
});

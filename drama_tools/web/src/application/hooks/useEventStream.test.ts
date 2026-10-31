import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useEventStream } from '@/application/hooks/useEventStream';
import { openProjectEventStream } from '@/infrastructure/api/dramaApi';
import { useProjectStore } from '@/application/stores/projectStore';

vi.mock('@/infrastructure/api/dramaApi', () => ({
  openProjectEventStream: vi.fn(),
  parseGenEvent: (raw: string) => JSON.parse(raw),
}));

/** UT-FE-04 useEventStream：收到 done 帧断言 es.close() 被调用（防重连死循环）。 */
describe('useEventStream', () => {
  beforeEach(() => {
    useProjectStore.getState().reset();
    vi.resetAllMocks();
  });

  it('收到 type=done 帧 → es.close() 被调用一次', () => {
    let esClose: ReturnType<typeof vi.fn> | null = null;
    let onDone: ((e: MessageEvent<string>) => void) | null = null;

    vi.mocked(openProjectEventStream).mockImplementation(() => {
      const es = {
        addEventListener: vi.fn((_type: string, cb: EventListener) => {
          if (_type === 'done') onDone = cb as unknown as (e: MessageEvent<string>) => void;
        }),
        close: vi.fn(),
        onopen: null,
        onerror: null,
      } as unknown as EventSource & { addEventListener: (t: string, cb: EventListener) => void };
      esClose = (es as unknown as { close: ReturnType<typeof vi.fn> }).close;
      return es as unknown as EventSource;
    });

    renderHook(() => useEventStream(7));

    // 模拟 done 帧到达：SSE 监听器接收的是 MessageEvent（读 e.data），故传事件对象
    const evt = { data: JSON.stringify({ projectId: 7, type: 'done', message: '完成', ts: 1 }) } as MessageEvent<string>;
    (onDone as ((e: MessageEvent<string>) => void) | null)?.(evt);
    expect(esClose).toHaveBeenCalledTimes(1);
  });

  it('无效 projectId 不建立连接', () => {
    renderHook(() => useEventStream(null));
    expect(openProjectEventStream).not.toHaveBeenCalled();
    renderHook(() => useEventStream(0));
    expect(openProjectEventStream).not.toHaveBeenCalled();
  });
});

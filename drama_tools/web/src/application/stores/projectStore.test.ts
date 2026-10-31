import { describe, it, expect, beforeEach } from 'vitest';
import { useProjectStore } from '@/application/stores/projectStore';
import type { GenEvent } from '@/shared/types';

/** UT-FE-01 projectStore.pushEvent 环形缓冲。 */
describe('useProjectStore.pushEvent', () => {
  beforeEach(() => useProjectStore.getState().reset());

  const mkEvent = (i: number): GenEvent => ({
    projectId: 1,
    type: 'info',
    message: `evt-${i}`,
    ts: Date.now() + i,
  });

  it('超限丢弃最旧（环形缓冲 MAX=200）', () => {
    const s = useProjectStore.getState();
    for (let i = 0; i < 250; i++) s.pushEvent(mkEvent(i));
    const events = useProjectStore.getState().events;
    expect(events.length).toBe(200);
    expect(events[0].message).toBe('evt-50'); // 前 50 条被丢弃
    expect(events[199].message).toBe('evt-249');
  });

  it('未超限保留全部', () => {
    const s = useProjectStore.getState();
    s.pushEvent(mkEvent(0));
    s.pushEvent(mkEvent(1));
    expect(useProjectStore.getState().events.length).toBe(2);
  });

  it('setProject 重置事件并记录 id', () => {
    useProjectStore.getState().pushEvent(mkEvent(0));
    useProjectStore.getState().setProject(42);
    const s = useProjectStore.getState();
    expect(s.projectId).toBe(42);
    expect(s.events.length).toBe(0);
  });
});

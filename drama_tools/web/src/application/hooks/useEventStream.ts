import { useEffect } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { openProjectEventStream, parseGenEvent } from '@/infrastructure/api/dramaApi';

/**
 * 订阅某项目的 SSE 生成日志流（复刻 sghouse useEventStream）：
 * - 收到事件 push 进 projectStore.events（环形缓冲）。
 * - 收到终态帧 done → 手动 close，防 EventSource 重连死循环。
 * - 运行中断线交给内置重连 + useVideoPoll 轮询兜底。
 * UT-FE-04：done 帧断言 es.close() 被调用。
 */
export function useEventStream(projectId: number | null): void {
  const pushEvent = useProjectStore((s) => s.pushEvent);
  const setSseOpen = useProjectStore((s) => s.setSseOpen);

  useEffect(() => {
    if (projectId == null || !(projectId > 0)) return;

    let es: EventSource | null = openProjectEventStream(projectId);
    let terminated = false;
    setSseOpen(true);

    const onEvent = (e: MessageEvent<string>) => {
      const evt = parseGenEvent(e.data);
      if (!evt) return;
      pushEvent(evt);
      if (evt.type === 'done') {
        terminated = true;
        setSseOpen(false);
        es?.close();
        es = null;
      }
    };

    const types = ['info', 'outline', 'asset', 'keyframe', 'image', 'video', 'splice', 'download', 'think', 'tool', 'done'] as const;
    const es0 = es;
    types.forEach((t) => es0?.addEventListener(t, onEvent as EventListener));

    es0.onopen = () => {
      if (!terminated) setSseOpen(true);
    };
    es0.onerror = () => {
      if (terminated) return;
      setSseOpen(false);
    };

    return () => {
      terminated = true;
      es?.close();
      setSseOpen(false);
    };
  }, [projectId, pushEvent, setSseOpen]);
}

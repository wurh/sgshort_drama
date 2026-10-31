import { create } from 'zustand';
import type { GenEvent } from '@/shared/types';

/** 项目级 SSE 事件环形缓冲（复刻 sghouse schemeStore）。UT-FE-01。 */
const MAX_EVENTS = 200;

interface ProjectState {
  projectId: number | null;
  events: GenEvent[];
  sseOpen: boolean;
  setProject: (id: number) => void;
  reset: () => void;
  pushEvent: (evt: GenEvent) => void;
  setSseOpen: (open: boolean) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projectId: null,
  events: [],
  sseOpen: false,
  setProject: (id) => set({ projectId: id, events: [], sseOpen: false }),
  reset: () => set({ projectId: null, events: [], sseOpen: false }),
  pushEvent: (evt) =>
    set((s) => {
      // 环形缓冲：超限丢弃最旧
      const next = [...s.events, evt];
      return { events: next.length > MAX_EVENTS ? next.slice(next.length - MAX_EVENTS) : next };
    }),
  setSseOpen: (open) => set({ sseOpen: open }),
}));

import '@testing-library/jest-dom';

// jsdom 缺少部分浏览器 API，antd 的响应式断点 / 滚动观测需要它们
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }
  if (!window.ResizeObserver) {
    window.ResizeObserver = class {
      static observe() {}
      static unobserve() {}
      static disconnect() {}
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }
  if (!window.EventSource) {
    // 测试环境提供 EventSource 桩，供 useEventStream / openProjectEventStream 使用
    (window as unknown as { EventSource: unknown }).EventSource = class {
      readyState = 1;
      addEventListener() {}
      removeEventListener() {}
      close() {
        this.readyState = 2;
      }
      onopen: (() => void) | null = null;
      onerror: (() => void) | null = null;
      onmessage: ((e: MessageEvent) => void) | null = null;
    };
  }
}

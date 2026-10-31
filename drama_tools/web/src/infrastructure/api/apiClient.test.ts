import { describe, it, expect } from 'vitest';
import { unwrap, ApiError, getApiBaseURL } from '@/infrastructure/api/apiClient';

/** UT-FE-05 unwrap：code!==0 抛 ApiError；网络错归一化为 ApiError；非信封响应必须报错而非返回 undefined。 */
describe('unwrap', () => {
  it('code===0 返回 data', async () => {
    const p = Promise.resolve({ data: { code: 0, msg: 'ok', data: { hello: 'x' } } as any });
    const r = await unwrap(p);
    expect(r).toEqual({ hello: 'x' });
  });

  it('code!==0 抛 ApiError（携带 code 与 msg）', async () => {
    const p = Promise.resolve({ data: { code: 40901, msg: '内容合规拦截', data: null } as any });
    await expect(unwrap(p)).rejects.toThrow(ApiError);
    try {
      await unwrap(p);
    } catch (e) {
      expect((e as ApiError).code).toBe(40901);
      expect((e as ApiError).message).toBe('内容合规拦截');
    }
  });

  it('网络错（reject）归一化为 ApiError', async () => {
    const p = Promise.reject(new Error('Network Error'));
    await expect(unwrap(p)).rejects.toThrow(ApiError);
  });

  // 回归：baseURL 漏 /api 时静态服务返回 index.html，旧实现会解包出 undefined → 页面白屏
  it('响应是 HTML 而非信封 → 抛 ApiError 且提示缺少 /api 前缀', async () => {
    const p = Promise.resolve({
      data: '<!doctype html><html></html>' as any,
      headers: { 'content-type': 'text/html' },
    });
    await expect(unwrap(p)).rejects.toThrow(ApiError);
    try {
      await unwrap(p);
    } catch (e) {
      expect((e as ApiError).message).toContain('/api');
    }
  });

  it('响应为 undefined / 空对象 → 抛 ApiError（绝不返回 undefined）', async () => {
    await expect(unwrap(Promise.resolve({ data: undefined as any }))).rejects.toThrow(ApiError);
    await expect(unwrap(Promise.resolve({ data: {} as any }))).rejects.toThrow(ApiError);
  });
});

describe('getApiBaseURL', () => {
  it('默认同源时带上 /api 前缀', () => {
    expect(getApiBaseURL()).toBe('/api');
  });

  it('配置了 API_BASE_URL 时拼在其后并去掉尾斜杠', () => {
    (window as any)._env_ = { API_BASE_URL: 'http://api.test/' };
    try {
      expect(getApiBaseURL()).toBe('http://api.test/api');
    } finally {
      delete (window as any)._env_;
    }
  });
});

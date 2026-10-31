import axios, { AxiosError, AxiosInstance } from 'axios';
import type { ApiResponse } from '@/shared/types';

declare global {
  interface Window {
    _env_?: Record<string, string>;
  }
}

/** 运行时配置：baseURL 从 window._env_ 读，同源默认空串走 vite 代理。 */
export function getBaseURL(): string {
  const env = (window as unknown as { _env_?: { API_BASE_URL?: string } })._env_;
  if (env?.API_BASE_URL) return env.API_BASE_URL.replace(/\/+$/, '');
  return '';
}

/**
 * API 根地址：后端全局前缀为 /api（见 server main.ts setGlobalPrefix('api')）。
 * 同源部署走 vite 代理 /api → 后端；显式配了 API_BASE_URL 时拼在其后。
 * 注意：漏掉 /api 会被 vite/nginx 当 SPA 路由返回 index.html，导致解包出 undefined。
 */
export function getApiBaseURL(): string {
  return `${getBaseURL()}/api`;
}

export const apiClient: AxiosInstance = axios.create({
  // 不在这里定死 baseURL：改为请求拦截时动态读取，
  // 否则模块加载后 window._env_ 变更（测试/运行时注入）不生效。
  timeout: 120_000,
  // 不硬编码 Content-Type：JSON 由 axios 自动补，FormData 由浏览器带 boundary。
});

// 每个请求前解析一次 baseURL，保证运行时配置真正生效。
apiClient.interceptors.request.use((config) => {
  if (!config.baseURL) config.baseURL = getApiBaseURL();
  return config;
});

export class ApiError extends Error {
  constructor(
    public readonly code: number,
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** 解包 { code, msg, data } 信封；code!==0 抛 ApiError。网络错归一化。UT-FE-05。 */
export async function unwrap<T>(p: Promise<{ data: ApiResponse<T> }>): Promise<T> {
  try {
    const res = await p;
    const body = res.data as unknown as ApiResponse<T>;
    // 防御：非信封响应（典型是 baseURL 漏了 /api，被静态服务/代理当成 SPA 路由返回 index.html）。
    // 绝不静默返回 undefined，否则页面里 .length / .map 直接白屏。
    if (!body || typeof body !== 'object' || typeof body.code !== 'number') {
      const ctype = (res as unknown as { headers?: Record<string, string> }).headers?.['content-type'];
      throw new ApiError(
        0,
        ctype?.includes('text/html')
          ? '接口返回了 HTML 而非 JSON，请检查 API baseURL 是否缺少 /api 前缀'
          : '接口返回格式异常：缺少 {code,msg,data} 信封',
      );
    }
    if (body.code !== 0) {
      throw new ApiError(body.code, body.msg);
    }
    return body.data as T;
  } catch (e) {
    if (e instanceof ApiError) throw e;
    const ax = e as AxiosError<{ code: number; msg: string }>;
    if (ax.response) {
      const b = ax.response.data;
      throw new ApiError(b?.code ?? ax.response.status, b?.msg ?? ax.message, ax.response.status);
    }
    throw new ApiError(0, e instanceof Error ? e.message : String(e));
  }
}

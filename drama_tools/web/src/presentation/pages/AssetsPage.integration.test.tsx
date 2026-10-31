import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { AssetsPage } from './AssetsPage';
import type { AssetView } from '@/shared/types';

/**
 * 集成测试：用真实 apiClient（不走 mock）打本地后端，验证「资产库不再永久 loading、
 * 能拿到真实出图结果」这条用户路径。
 *
 * 后端不可达时用例内部直接跳过（CI 无后端不会红灯）；本地起好后端即自动生效：
 *   cd server && node dist/main.js
 *   cd web && node node_modules/vitest/vitest.mjs run AssetsPage.integration
 */

const hasBackend = async (): Promise<boolean> => {
  try {
    const r = await fetch('http://127.0.0.1:8731/api/health');
    return r.ok;
  } catch {
    return false;
  }
};

describe('<AssetsPage /> 接真实后端', () => {
  beforeEach(() => {
    // apiClient 默认 baseURL='' 走 vite 代理；这里直接指到后端端口
    (window as any)._env_ = { API_BASE_URL: 'http://127.0.0.1:8731' };
  });
  afterEach(() => {
    delete (window as any)._env_;
  });

  it('项目 3 的角色列表能正常渲染，且不卡在 loading', async () => {
    if (!(await hasBackend())) return;
    const res = await fetch('http://127.0.0.1:8731/api/projects/3/assets?type=character');
    const body = await res.json();
    const rows: AssetView[] = body.data;
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
    // 关键回归：不能全部停在 generating（那会让前端永久 loading）
    const allGenerating = rows.every((r) => r.status === 'generating');
    expect(allGenerating).toBe(false);
  });

  it('真实数据渲染出资产卡片与图片', async () => {
    if (!(await hasBackend())) return;
    render(
      <AntdApp>
        <MemoryRouter initialEntries={['/projects/3/assets']}>
          <AssetsPage projectId={3} />
        </MemoryRouter>
      </AntdApp>,
    );
    await waitFor(() => expect(screen.getByTestId('assets-page')).toBeInTheDocument(), {
      timeout: 8000,
    });
    // 至少渲染出一张已经出图的卡片（角色已批量生成完）
    await waitFor(() => expect(screen.getAllByRole('img').length).toBeGreaterThan(0), {
      timeout: 10000,
    });
    expect(screen.queryByText('生成中…')).not.toBeInTheDocument();
  });
});
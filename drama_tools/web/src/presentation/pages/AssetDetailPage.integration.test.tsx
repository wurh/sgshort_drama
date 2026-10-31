import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { AssetDetailPage } from './AssetDetailPage';

/**
 * 集成测试（真实后端）：详情页三栏能渲染出形象 Tab / 立绘 / 四视图。
 * 后端不可达时用例内部跳过。
 *   cd server && node dist/main.js
 *   cd web && node node_modules/vitest/vitest.mjs run AssetDetailPage.integration
 */
const hasBackend = async (): Promise<boolean> => {
  try {
    const r = await fetch('http://127.0.0.1:8731/api/health');
    return r.ok;
  } catch {
    return false;
  }
};

describe('<AssetDetailPage /> 接真实后端', () => {
  beforeEach(() => {
    (window as any)._env_ = { API_BASE_URL: 'http://127.0.0.1:8731' };
  });
  afterEach(() => {
    delete (window as any)._env_;
  });

  it('项目 3 第一个角色详情能渲染三栏与形象 Tab', async () => {
    if (!(await hasBackend())) return;
    const head = await fetch('http://127.0.0.1:8731/api/projects/3/assets?type=character');
    const body = await head.json();
    const assetId = body.data[0]?.id;
    expect(assetId).toBeTruthy();

    render(
      <AntdApp>
        <MemoryRouter initialEntries={[`/projects/3/assets/${assetId}`]}>
          <AssetDetailPage projectId={3} assetId={assetId} />
        </MemoryRouter>
      </AntdApp>,
    );

    await waitFor(() => expect(screen.getByTestId('asset-detail-page')).toBeInTheDocument(), {
      timeout: 8000,
    });
    // 形象 Tab 至少有「基础形象」
    await waitFor(() => expect(screen.getByText('基础形象')).toBeInTheDocument());
    // 三栏的关键操作都在
    expect(screen.getByTestId('gen-portrait')).toBeInTheDocument();
    expect(screen.getByTestId('gen-sheet')).toBeInTheDocument();
    expect(screen.getByTestId('detail-save')).toBeInTheDocument();
    expect(screen.getByTestId('open-style-picker')).toBeInTheDocument();
  });

  it('已生成的资产能展示立绘与四视图图片', async () => {
    if (!(await hasBackend())) return;
    const head = await fetch('http://127.0.0.1:8731/api/projects/3/assets?type=character');
    const body = await head.json();
    const withImg = body.data.find((a: any) => a.base_image_url);
    if (!withImg) return;

    render(
      <AntdApp>
        <MemoryRouter initialEntries={[`/projects/3/assets/${withImg.id}`]}>
          <AssetDetailPage projectId={3} assetId={withImg.id} />
        </MemoryRouter>
      </AntdApp>,
    );

    await waitFor(() => expect(screen.getByTestId('asset-detail-page')).toBeInTheDocument());
    await waitFor(() => expect(screen.getAllByRole('img').length).toBeGreaterThan(0), {
      timeout: 8000,
    });
  });
});
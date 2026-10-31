import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { ProjectShell } from './ProjectShell';

/**
 * UT-FE-07 步骤路由（回归）：
 * /projects/:id/:step 必须渲染对应步骤页。
 * 曾经的 bug：ProjectShell 用 seg[1] 取步骤名，实际 seg[1] 是项目 ID，
 * 导致 /projects/3/assets 永远渲染大纲页、StepBar 高亮也永远停在第 1 步。
 */
vi.mock('@/infrastructure/api/dramaApi', async () => {
  const actual = await import('@/infrastructure/api/dramaApi');
  return {
    ...actual,
    getProject: vi.fn().mockResolvedValue({ id: 3, title: '你好，世界' }),
    getOutline: vi.fn().mockResolvedValue(null),
    saveOutline: vi.fn(),
    generateOutline: vi.fn(),
    listAssets: vi.fn().mockResolvedValue([]),
    getAsset: vi.fn().mockResolvedValue({
      id: 1,
      project_id: 3,
      type: 'character',
      name: '李富贵',
      desc: '十七岁中国男性',
      base_image_url: null,
      extra_images: [],
      status: 'pending',
      sync_enabled: true,
      auto_sync: false,
      cost_ms: null,
      error: null,
      image_count: 0,
      variants: [
        {
          id: 'v1',
          name: '基础形象',
          desc: '',
          style_key: null,
          model: null,
          portrait_url: null,
          sheet_url: null,
          gallery: [],
          apply_to_all: false,
          kind: 'base',
          status: 'pending',
          error: null,
          cost_ms: null,
          created_at: 0,
        },
      ],
      variant_names: ['基础形象'],
    }),
    createAsset: vi.fn(),
    generateBaseImage: vi.fn(),
    addAssetImage: vi.fn(),
    toggleAssetSync: vi.fn(),
    deleteAsset: vi.fn(),
    listEpisodes: vi.fn().mockResolvedValue([]),
    generateScript: vi.fn(),
    listKeyframes: vi.fn().mockResolvedValue([]),
    videoProgress: vi.fn().mockResolvedValue({
      total: 1, completed: 1, failed: 0, running: 0, all_done: true, all_completed: true,
    }),
    openProjectEventStream: vi.fn(() => ({
      addEventListener: vi.fn(),
      close: vi.fn(),
      onerror: null,
    })),
  };
});

function RedirectToOutline() {
  const { id } = useParams();
  return <Navigate to={`/projects/${id}/outline`} replace />;
}

const renderAt = (path: string) =>
  render(
    <AntdApp>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/projects/:id" element={<RedirectToOutline />} />
          <Route path="/projects/:id/outline" element={<ProjectShell />} />
          <Route path="/projects/:id/assets" element={<ProjectShell />} />
          <Route path="/projects/:id/assets/:assetId" element={<ProjectShell />} />
          <Route path="/projects/:id/episodes" element={<ProjectShell />} />
          <Route path="/projects/:id/episodes/:episodeId" element={<ProjectShell />} />
        </Routes>
      </MemoryRouter>
    </AntdApp>,
  );

describe('步骤路由（回归）', () => {
  // 用 clearAllMocks 而非 resetAllMocks：后者会连 mock 实现一起清空，
  // 导致 openProjectEventStream 返回 undefined、useEventStream 直接崩。
  beforeEach(() => vi.clearAllMocks());

  it('/projects/3/assets 渲染资产库，而非大纲页', async () => {
    renderAt('/projects/3/assets');
    await waitFor(() => expect(screen.getByTestId('assets-page')).toBeInTheDocument());
    expect(screen.queryByTestId('outline-page')).not.toBeInTheDocument();
  });

  it('/projects/3/outline 渲染大纲页', async () => {
    renderAt('/projects/3/outline');
    await waitFor(() => expect(screen.getByTestId('outline-page')).toBeInTheDocument());
    expect(screen.queryByTestId('assets-page')).not.toBeInTheDocument();
  });

  it('/projects/3/episodes 渲染分集列表', async () => {
    renderAt('/projects/3/episodes');
    await waitFor(() => expect(screen.getByTestId('episodes-page')).toBeInTheDocument());
    expect(screen.queryByTestId('outline-page')).not.toBeInTheDocument();
  });

  it('/projects/3/assets/1 渲染资产详情三栏页', async () => {
    renderAt('/projects/3/assets/1');
    await waitFor(() => expect(screen.getByTestId('asset-detail-page')).toBeInTheDocument());
    // 详情页不能退化成列表页
    expect(screen.queryByTestId('assets-page')).not.toBeInTheDocument();
  });

  it('顶部导航显示项目名与步骤条', async () => {
    renderAt('/projects/3/assets');
    await waitFor(() => expect(screen.getByTestId('app-header')).toBeInTheDocument());
    expect(screen.getByTestId('stepbar')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId('header-title')).toHaveTextContent('你好，世界'));
  });

  it('访问 /projects/3 会跳到真实 id 的 outline，而非字面量 :id', async () => {
    const { container } = renderAt('/projects/3');
    await waitFor(() => expect(screen.getByTestId('outline-page')).toBeInTheDocument());
    // 关键：不能停在字面量 /projects/:id/outline
    expect(container.innerHTML).not.toContain(':id');
  });
});
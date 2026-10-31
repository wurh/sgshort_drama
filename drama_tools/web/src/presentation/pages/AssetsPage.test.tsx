import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { AssetsPage, galleryOf } from './AssetsPage';
import { listAssets, setProjectAssetsSync } from '@/infrastructure/api/dramaApi';
import { makeAsset, makeVariant } from '@/test/fixtures';

/**
 * UT-FE-09 资产库（列表页，设计稿改版）：
 * 1) 胶囊 Tab 能切换并重新按类型拉取；
 * 2) 卡片展示「已添加形象 n/4」与缩略图组；
 * 3) pending 草稿按钮可点，generating 时显示生成中，failed 显示原因；
 * 4) 顶部「同步资产 / 自动同步」能批量设置；
 * 5) 接口失败给可读错误与重试，不白屏。
 */
vi.mock('@/infrastructure/api/dramaApi', async () => {
  const actual = await import('@/infrastructure/api/dramaApi');
  return {
    ...actual,
    listAssets: vi.fn(),
    createAsset: vi.fn(),
    setProjectAssetsSync: vi.fn(),
    deleteAsset: vi.fn(),
    generateAssetBase: vi.fn(),
  };
});

const renderPage = () =>
  render(
    <AntdApp>
      <MemoryRouter initialEntries={['/projects/3/assets']}>
        <AssetsPage projectId={3} />
      </MemoryRouter>
    </AntdApp>,
  );

describe('<AssetsPage />（资产列表）', () => {
  beforeEach(() => vi.clearAllMocks());

  it('渲染角色卡片与「已添加形象」计数', async () => {
    vi.mocked(listAssets).mockResolvedValue([
      makeAsset({ id: 1, name: '林远' }),
      makeAsset({ id: 2, name: '阿豪' }),
    ]);
    renderPage();

    await waitFor(() => expect(screen.getByText('林远')).toBeInTheDocument());
    expect(screen.getByText('阿豪')).toBeInTheDocument();
    expect(screen.getByTestId('assets-page')).toBeInTheDocument();
    expect(vi.mocked(listAssets)).toHaveBeenCalledWith(3, 'character');
    expect(screen.getAllByText(/已添加形象 \d\/4/).length).toBeGreaterThan(0);
  });

  it('图组有图时渲染缩略图', async () => {
    vi.mocked(listAssets).mockResolvedValue([
      makeAsset({
        id: 1,
        name: '林远',
        base_image_url: 'https://cdn/base.png',
        variants: [
          makeVariant({
            portrait_url: 'https://cdn/base.png',
            gallery: ['https://cdn/a.png', 'https://cdn/b.png'],
            status: 'done',
          }),
        ],
      }),
    ]);
    renderPage();

    await waitFor(() => expect(screen.getByText('林远')).toBeInTheDocument());
    expect(screen.getByText('已添加形象 2/4')).toBeInTheDocument();
    expect(screen.getByAltText('林远')).toHaveAttribute('src', 'https://cdn/base.png');
  });

  /**
   * 回归：用户截图反馈「这些生成完了，为什么还是没有形象？」
   * 后端返回的资产只有 portrait/sheet、gallery 是空的时，
   * 卡片不能显示「0/4 + 一排空框」，要按立绘/四视图兜底计数。
   */
  it('生成完但图组为空：用立绘/四视图兜底显示，不显示 0/4', async () => {
    vi.mocked(listAssets).mockResolvedValue([
      makeAsset({
        id: 3,
        name: '阿豪',
        base_image_url: 'https://cdn/p.png',
        status: 'done',
        variants: [
          makeVariant({
            id: 'asset-3-base',
            kind: 'base',
            status: 'done',
            portrait_url: 'https://cdn/p.png',
            sheet_url: 'https://cdn/s.png',
            gallery: [],
          }),
        ],
      }),
    ]);
    renderPage();

    await waitFor(() => expect(screen.getByText('阿豪')).toBeInTheDocument());
    expect(screen.getByText('已添加形象 2/4')).toBeInTheDocument();
    expect(screen.queryByText('已添加形象 0/4')).toBeNull();
  });

  it('galleryOf：图组有内容时优先用图组顺序，未被兜底覆盖', () => {
    const asset = makeAsset({
      base_image_url: 'https://cdn/base.png',
      variants: [
        makeVariant({
          portrait_url: 'https://cdn/p.png',
          sheet_url: 'https://cdn/s.png',
          gallery: ['https://cdn/g1.png'],
        }),
      ],
    });
    expect(galleryOf(asset)).toEqual(['https://cdn/g1.png']);
  });

  it('galleryOf：多形象时把每个形象的图都收进缩略图（最多 4 张）', () => {
    const asset = makeAsset({
      base_image_url: 'https://cdn/base.png',
      variants: [
        makeVariant({
          id: 'v-base',
          kind: 'base',
          portrait_url: 'https://cdn/p.png',
          sheet_url: 'https://cdn/s.png',
        }),
        makeVariant({
          id: 'v-2',
          kind: 'custom',
          name: '旧校服',
          portrait_url: 'https://cdn/p2.png',
        }),
        makeVariant({ id: 'v-3', kind: 'custom', name: '空形象' }),
      ],
    });
    expect(galleryOf(asset)).toEqual([
      'https://cdn/p.png',
      'https://cdn/s.png',
      'https://cdn/p2.png',
    ]);
  });

  it('galleryOf：无形象数据时回退 base_image_url + extra_images，最多 4 张且去重', () => {
    const asset = makeAsset({
      base_image_url: 'https://cdn/base.png',
      extra_images: ['https://cdn/e1.png', 'https://cdn/base.png', 'https://cdn/e2.png'],
      variants: [],
    });
    const g = galleryOf(asset);
    expect(g[0]).toBe('https://cdn/base.png');
    expect(new Set(g).size).toBe(g.length);
    expect(g.length).toBeLessThanOrEqual(4);
  });

  it('切到「场景列表」按 scene 重新拉取', async () => {
    vi.mocked(listAssets).mockResolvedValue([]);
    renderPage();
    await waitFor(() => expect(vi.mocked(listAssets)).toHaveBeenCalledWith(3, 'character'));

    fireEvent.click(screen.getByTestId('assets-tab-scene'));
    await waitFor(() => expect(vi.mocked(listAssets)).toHaveBeenCalledWith(3, 'scene'));
  });

  it('pending 草稿：生成按钮可点，文案为「生成基础形象」', async () => {
    vi.mocked(listAssets).mockResolvedValue([makeAsset({ id: 1, name: '林远', status: 'pending' })]);
    renderPage();

    const btn = await screen.findByTestId('asset-regen-1');
    expect(btn).toBeEnabled();
    expect(btn.textContent).toContain('生成基础形象');
  });

  it('generating：显示生成中且按钮禁用', async () => {
    vi.mocked(listAssets).mockResolvedValue([
      makeAsset({ id: 1, name: '林远', status: 'generating' }),
    ]);
    renderPage();

    await waitFor(() => expect(screen.getByText('生成中…')).toBeInTheDocument());
    expect(screen.getByTestId('asset-regen-1')).toBeDisabled();
  });

  it('failed：展示错误原因 + 重试文案', async () => {
    vi.mocked(listAssets).mockResolvedValue([
      makeAsset({ id: 1, name: '林远', status: 'failed', error: 'agnes image 400: bad request' }),
    ]);
    renderPage();

    await waitFor(() =>
      expect(screen.getByText(/agnes image 400: bad request/)).toBeInTheDocument(),
    );
    expect(screen.getByTestId('asset-regen-1').textContent).toContain('重试生成');
  });

  it('顶部「同步资产」开关调用批量接口', async () => {
    vi.mocked(listAssets).mockResolvedValue([makeAsset({ id: 1, sync_enabled: true })]);
    vi.mocked(setProjectAssetsSync).mockResolvedValue({ updated: 1 });
    renderPage();

    await waitFor(() => expect(screen.getByText('林远')).toBeInTheDocument());
    const sw = screen.getByTestId('switch-sync-all');
    fireEvent.click(sw);
    await waitFor(() =>
      expect(vi.mocked(setProjectAssetsSync)).toHaveBeenCalledWith(3, { sync_enabled: false }),
    );
  });

  it('接口失败展示错误 + 重试，不白屏', async () => {
    vi.mocked(listAssets).mockRejectedValue(new Error('资产列表加载失败'));
    renderPage();

    await waitFor(() => expect(screen.getByText('资产列表加载失败')).toBeInTheDocument());
    expect(screen.getByTestId('assets-page')).toBeInTheDocument();
    expect(screen.getByText(/^重\s*试$/)).toBeInTheDocument();
  });

  it('空数据展示空态提示', async () => {
    vi.mocked(listAssets).mockResolvedValue([]);
    renderPage();
    await waitFor(() => expect(screen.getByText(/暂无角色/)).toBeInTheDocument());
  });
});
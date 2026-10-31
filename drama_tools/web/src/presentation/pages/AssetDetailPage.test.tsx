import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { AssetDetailPage } from './AssetDetailPage';
import {
  getAsset,
  updateAssetVariant,
  generateVariantImage,
  addVariantGallery,
} from '@/infrastructure/api/dramaApi';
import { makeAsset, makeVariant } from '@/test/fixtures';

/**
 * UT-FE-11 资产详情页（回归）。
 *
 * 用户报告：详情页「点保存 / 切风格」报 variant xxx not found。
 * 根因在后端（老数据 variants=null 时每次读都合成新 uuid），
 * 前端要保证的是：**始终用当前列表里的有效形象 id 发请求**，
 * 不能缓存一个已经失效的 id。本文件锁住这条行为。
 */
vi.mock('@/infrastructure/api/dramaApi', async () => {
  const actual = await import('@/infrastructure/api/dramaApi');
  return {
    ...actual,
    getAsset: vi.fn(),
    updateAssetVariant: vi.fn(),
    generateVariantImage: vi.fn(),
    addVariantGallery: vi.fn(),
    createAssetVariant: vi.fn(),
    deleteAssetVariant: vi.fn(),
    listStyles: vi.fn().mockResolvedValue([]),
  };
});

const renderPage = () =>
  render(
    <AntdApp>
      <MemoryRouter initialEntries={['/projects/3/assets/3']}>
        <AssetDetailPage projectId={3} assetId={3} />
      </MemoryRouter>
    </AntdApp>,
  );

const buildAsset = () =>
  makeAsset({
    id: 3,
    name: '阿豪',
    desc: '反派混混',
    base_image_url: 'https://cdn.test/a.png',
    variants: [
      makeVariant({
        id: 'asset-3-base',
        name: '基础形象',
        kind: 'base',
        status: 'done',
        portrait_url: 'https://cdn.test/a.png',
      }),
    ],
  });

describe('<AssetDetailPage />（详情页）', () => {
  beforeEach(() => vi.clearAllMocks());

  it('渲染三栏：左栏表单、中栏立绘、右栏四视图占位', async () => {
    vi.mocked(getAsset).mockResolvedValue(buildAsset());
    renderPage();

    await waitFor(() => expect(screen.getByTestId('asset-detail-page')).toBeInTheDocument());
    expect(screen.getByTestId('variant-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('detail-save')).toBeInTheDocument();
    expect(screen.getByTestId('gen-portrait')).toBeInTheDocument();
    expect(screen.getByTestId('gen-sheet')).toBeInTheDocument();
    expect(screen.getByText('四视图（正 / 侧 / 背 全身）')).toBeInTheDocument();
  });

  /**
   * 核心回归：保存时必须带**当前形象的真实 id**。
   * 若前端缓存了过期 id，后端就会返回 variant not found。
   */
  it('点保存 → 用当前形象 id 提交，不报 not found', async () => {
    const asset = buildAsset();
    vi.mocked(getAsset).mockResolvedValue(asset);
    vi.mocked(updateAssetVariant).mockResolvedValue(asset);
    renderPage();

    await waitFor(() => expect(screen.getByTestId('detail-save')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('detail-save'));

    await waitFor(() =>
      expect(updateAssetVariant).toHaveBeenCalledWith(
        3,
        3,
        'asset-3-base',
        expect.objectContaining({ name: expect.any(String) }),
      ),
    );
  });

  it('切换形象 Tab 后再保存，提交的是切换后的形象 id', async () => {
    const asset = makeAsset({
      id: 3,
      name: '阿豪',
      base_image_url: 'https://cdn.test/a.png',
      variants: [
        makeVariant({ id: 'asset-3-base', name: '基础形象', kind: 'base', status: 'done' }),
        makeVariant({ id: 'v-custom-1', name: '旧校服', kind: 'custom', status: 'pending' }),
      ],
    });
    vi.mocked(getAsset).mockResolvedValue(asset);
    vi.mocked(updateAssetVariant).mockResolvedValue(asset);
    renderPage();

    await waitFor(() => expect(screen.getByTestId('variant-tab-v-custom-1')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('variant-tab-v-custom-1'));
    await waitFor(() => expect(screen.getByTestId('variant-name-input')).toHaveValue('旧校服'));

    fireEvent.click(screen.getByTestId('detail-save'));
    await waitFor(() =>
      expect(updateAssetVariant).toHaveBeenCalledWith(
        3,
        3,
        'v-custom-1',
        expect.anything(),
      ),
    );
  });

  it('点击生成四视图 → 用当前形象 id 调用生成接口', async () => {
    const asset = buildAsset();
    vi.mocked(getAsset).mockResolvedValue(asset);
    vi.mocked(generateVariantImage).mockResolvedValue(asset);
    renderPage();

    await waitFor(() => expect(screen.getByTestId('gen-sheet')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('gen-sheet'));

    // 角色固定 3:4，不传比例覆盖（第 5 个参数为 undefined）
    await waitFor(() =>
      expect(generateVariantImage).toHaveBeenCalledWith(
        3,
        3,
        'asset-3-base',
        'sheet',
        undefined,
      ),
    );
  });

  it('示意图组「+」：有图时调追加接口，无图时提示先生成', async () => {
    const asset = buildAsset();
    vi.mocked(getAsset).mockResolvedValue(asset);
    vi.mocked(addVariantGallery).mockResolvedValue(asset);
    renderPage();

    await waitFor(() => expect(screen.getByTestId('collect-portrait')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('collect-portrait'));

    await waitFor(() =>
      expect(addVariantGallery).toHaveBeenCalledWith(3, 3, 'asset-3-base', 'https://cdn.test/a.png'),
    );
  });

  it('生成完但图组为空：详情页「已添加形象」按立绘/四视图兜底，不显示 0/4', async () => {
    vi.mocked(getAsset).mockResolvedValue(
      makeAsset({
        id: 3,
        name: '阿豪',
        base_image_url: 'https://cdn.test/a.png',
        status: 'done',
        variants: [
          makeVariant({
            id: 'asset-3-base',
            name: '基础形象',
            kind: 'base',
            status: 'done',
            portrait_url: 'https://cdn.test/a.png',
            sheet_url: 'https://cdn.test/s.png',
            gallery: [],
          }),
        ],
      }),
    );
    renderPage();

    await waitFor(() => expect(screen.getByTestId('asset-detail-page')).toBeInTheDocument());
    expect(screen.getByText('已添加形象 2/4')).toBeInTheDocument();
    expect(screen.queryByText('已添加形象 0/4')).toBeNull();
  });

  /**
   * 用户反馈：场景详情页本该是「一张横版场景图」，结果套用了角色页的
   * 「竖版立绘 + 四视图」，横图被压成细条、右侧还有一块空的四视图区。
   */
  describe('场景 / 道具详情页（单图布局）', () => {
    const sceneAsset = (type: 'scene' | 'prop' = 'scene') =>
      makeAsset({
        id: type === 'scene' ? 4 : 5,
        type,
        name: type === 'scene' ? '1994年破旧街巷' : '折叠眼镜',
        base_image_url: 'https://cdn.test/scene.png',
        status: 'done',
        variants: [
          makeVariant({
            id: `asset-${type === 'scene' ? 4 : 5}-base`,
            name: '基础形象',
            kind: 'base',
            status: 'done',
            portrait_url: 'https://cdn.test/scene.png',
          }),
        ],
      });

    it('场景页不渲染四视图区，也不给声音/音色等角色字段', async () => {
      vi.mocked(getAsset).mockResolvedValue(sceneAsset('scene'));
      renderPage();

      await waitFor(() => expect(screen.getByTestId('asset-detail-page')).toBeInTheDocument());
      expect(screen.getByTestId('asset-detail-page')).toHaveAttribute('data-asset-type', 'scene');
      // 四视图生成入口（角色专属）不应出现
      expect(screen.queryByTestId('gen-sheet')).toBeNull();
      expect(screen.queryByText(/四视图（正 \/ 侧 \/ 背 全身）/)).toBeNull();
      // 角色专属字段
      expect(screen.queryByText('音色描述')).toBeNull();
      expect(screen.queryByTestId('variant-apply-all')).toBeNull();
      // 标题是「场景信息」
      expect(screen.getByText('场景信息')).toBeInTheDocument();
    });

    it('道具页标题为「道具信息」并保留单张主图', async () => {
      vi.mocked(getAsset).mockResolvedValue(sceneAsset('prop'));
      renderPage();

      await waitFor(() => expect(screen.getByText('道具信息')).toBeInTheDocument());
      expect(screen.getByTestId('asset-detail-page')).toHaveAttribute('data-asset-type', 'prop');
      expect(screen.getByTestId('gen-portrait')).toBeInTheDocument();
      expect(screen.queryByTestId('gen-sheet')).toBeNull();
    });

    it('场景页有比例控件（16:9 / 1:1 / 3:4），生成时把所选比例传给接口', async () => {
      const asset = sceneAsset('scene');
      vi.mocked(getAsset).mockResolvedValue(asset);
      vi.mocked(generateVariantImage).mockResolvedValue(asset);
      renderPage();

      await waitFor(() => expect(screen.getByTestId('ratio-16:9')).toBeInTheDocument());
      // 默认 16:9
      expect(screen.getByTestId('ratio-16:9')).toHaveAttribute('aria-selected', 'true');

      fireEvent.click(screen.getByTestId('ratio-1:1'));
      await waitFor(() =>
        expect(screen.getByTestId('ratio-1:1')).toHaveAttribute('aria-selected', 'true'),
      );

      fireEvent.click(screen.getByTestId('gen-portrait'));
      await waitFor(() =>
        expect(generateVariantImage).toHaveBeenCalledWith(
          3, // projectId（renderPage 固定 3）
          3, // assetId（renderPage 固定 3，与 fixture id 无关）
          'asset-4-base',
          'portrait',
          '1:1',
        ),
      );
    });

    it('场景页不显示比例控件之外的「四视图」按钮', async () => {
      vi.mocked(getAsset).mockResolvedValue(sceneAsset('scene'));
      renderPage();
      await waitFor(() => expect(screen.getByTestId('asset-detail-page')).toBeInTheDocument());
      expect(screen.queryByTestId('collect-sheet')).toBeNull();
    });
  });

  it('加载失败展示可读错误与重试，不白屏', async () => {
    vi.mocked(getAsset).mockRejectedValue(new Error('variant x not found'));
    renderPage();

    await waitFor(() => expect(screen.getByText(/variant x not found/)).toBeInTheDocument());
    // antd 会在两个中文字之间插空格（"重 试"），用正则规避
    expect(screen.getByRole('button', { name: /重\s*试/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /返回列表/ })).toBeInTheDocument();
  });
});
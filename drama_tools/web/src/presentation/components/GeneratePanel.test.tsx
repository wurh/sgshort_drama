import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { App as AntdApp } from 'antd';
import { GeneratePanel, DEFAULT_VIDEO_SETTINGS, DEFAULT_IMAGE_SETTINGS } from './GeneratePanel';
import { makeAsset, makeSegment } from '@/test/fixtures';
import type { GenerateSettings } from './GeneratePanel';

/**
 * 生成面板（右侧抽屉）：
 * - 图片面板：模型 / 风格 / 输出设置 1K-2K-4K / 生成图片
 * - 视频面板：额外有「镜头参考图」与「参考图」多选，输出设置 720p-1080p
 * - 没有关键帧时不允许提交视频（否则后端必然失败，白扣一次费用）
 */
function renderPanel(over: Partial<React.ComponentProps<typeof GeneratePanel>> = {}) {
  const onChange = vi.fn();
  const onSubmit = vi.fn();
  const onClose = vi.fn();
  render(
    <AntdApp>
      <GeneratePanel
        open
        kind="image"
        segment={makeSegment({ id: 1 })}
        assets={[]}
        settings={DEFAULT_IMAGE_SETTINGS}
        onChange={onChange}
        onSubmit={onSubmit}
        onClose={onClose}
        {...over}
      />
    </AntdApp>,
  );
  return { onChange, onSubmit, onClose };
}

beforeEach(() => vi.clearAllMocks());

describe('GeneratePanel 图片面板', () => {
  it('渲染模型行、风格行、输出设置与按钮文案', () => {
    renderPanel();
    expect(screen.getByTestId('panel-model').textContent).toContain('Agnes Image 2.5 Flash');
    expect(screen.getByTestId('panel-style')).toBeInTheDocument();
    expect(screen.getByTestId('panel-size').textContent).toContain('1K');
    expect(screen.getByTestId('panel-submit').textContent).toContain('生成图片');
    // 图片面板不该出现视频专属区域
    expect(screen.queryByTestId('panel-shot-ref')).toBeNull();
    expect(screen.queryByTestId('panel-refs')).toBeNull();
  });

  it('点提交触发 onSubmit', () => {
    const { onSubmit } = renderPanel();
    fireEvent.click(screen.getByTestId('panel-submit'));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('点风格行切换风格（再次点击取消）', () => {
    const { onChange } = renderPanel();
    fireEvent.click(screen.getByTestId('panel-style'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ styleLabel: '90年代写实电影风格' }),
    );
  });
});

describe('GeneratePanel 视频面板', () => {
  const segment = makeSegment({ id: 1, keyframe_url: 'https://cdn.test/kf.png' });

  it('渲染镜头参考图大图与参考图分组', async () => {
    renderPanel({
      kind: 'video',
      segment,
      assets: [
        makeAsset({
          id: 11,
          type: 'character',
          name: '吴明',
          base_image_url: 'https://cdn.test/a1.png',
        }),
        makeAsset({
          id: 12,
          type: 'scene',
          name: '废弃仓库',
          base_image_url: 'https://cdn.test/a2.png',
        }),
      ],
      settings: DEFAULT_VIDEO_SETTINGS,
    });

    expect(screen.getByTestId('panel-model').textContent).toContain('Agnes Video 2.5 Flash');
    const shotRef = screen.getByTestId('panel-shot-ref');
    expect(shotRef.querySelector('img')?.getAttribute('src')).toBe('https://cdn.test/kf.png');
    await waitFor(() => expect(screen.getByTestId('panel-refs')).toBeInTheDocument());
    expect(screen.getByText('吴明-基础形象')).toBeInTheDocument();
    expect(screen.getByText('废弃仓库-基础形象')).toBeInTheDocument();
  });

  it('自动预选最多 4 张参考图（否则用户以为没有参考素材）', async () => {
    const onChange = vi.fn();
    renderPanel({
      kind: 'video',
      segment,
      assets: Array.from({ length: 6 }).map((_, i) =>
        makeAsset({
          id: 20 + i,
          name: `角色${i}`,
          base_image_url: `https://cdn.test/r${i}.png`,
        }),
      ),
      settings: DEFAULT_VIDEO_SETTINGS,
      onChange,
    });
    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith({
        refImages: ['https://cdn.test/r0.png', 'https://cdn.test/r1.png', 'https://cdn.test/r2.png', 'https://cdn.test/r3.png'],
      }),
    );
  });

  it('没有关键帧时提交按钮禁用（避免必然失败的白跑）', () => {
    renderPanel({
      kind: 'video',
      segment: makeSegment({ id: 1, keyframe_url: null, shot_image_url: null }),
      settings: DEFAULT_VIDEO_SETTINGS,
    });
    expect(screen.getByTestId('panel-submit')).toBeDisabled();
    expect(screen.getByText('先生成关键帧作为参考')).toBeInTheDocument();
  });

  it('有图时切换参考图勾选', async () => {
    const onChange = vi.fn();
    const settings: GenerateSettings = { ...DEFAULT_VIDEO_SETTINGS, refImages: [] };
    renderPanel({
      kind: 'video',
      segment,
      assets: [
        makeAsset({ id: 11, name: '吴明', base_image_url: 'https://cdn.test/a1.png' }),
      ],
      settings,
      onChange,
    });
    await waitFor(() => expect(screen.getByTestId('panel-ref-吴明-基础形象')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('panel-ref-吴明-基础形象'));
    expect(onChange).toHaveBeenCalledWith({ refImages: ['https://cdn.test/a1.png'] });
  });

  it('视频面板输出设置默认 720p', () => {
    renderPanel({ kind: 'video', segment, settings: DEFAULT_VIDEO_SETTINGS });
    expect(screen.getByTestId('panel-size').textContent).toContain('720p');
    expect(screen.getByTestId('panel-submit').textContent).toContain('生成视频');
  });
});
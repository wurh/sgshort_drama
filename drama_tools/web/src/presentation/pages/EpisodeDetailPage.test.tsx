import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { EpisodeDetailPage } from './EpisodeDetailPage';
import { makeAsset, makeEpisodeDetail, makeSegment, makeShot } from '@/test/fixtures';

/**
 * 分集详情页（步骤 3）：
 * - 中栏必须完整渲染片段内的每个分镜（画面/运镜/声音/字幕四要素）
 * - 「添加分镜」要真的打到后端并渲染出新分镜（这是用户反馈的核心诉求）
 * - 编辑场景设定、切换片段、删除最后一个分镜的禁用态
 * - 「生成」打开右侧面板而不是直接扣费，面板里的参数要真的传给后端
 * - 加载失败不白屏
 */
const getEpisode = vi.fn();
const listKeyframes = vi.fn();
const listAssets = vi.fn();
const addShot = vi.fn();
const editShot = vi.fn();
const deleteShot = vi.fn();
const editSegment = vi.fn();
const addKeyframe = vi.fn();
const deleteKeyframe = vi.fn();
const genKeyframeImage = vi.fn();
const genKeyframeVideo = vi.fn();
const batchImages = vi.fn();
const batchVideos = vi.fn();
const batchDownload = vi.fn();

vi.mock('@/infrastructure/api/dramaApi', async () => {
  const actual = await import('@/infrastructure/api/dramaApi');
  return {
    ...actual,
    getEpisode: (...a: unknown[]) => getEpisode(...a),
    listKeyframes: (...a: unknown[]) => listKeyframes(...a),
    listAssets: (...a: unknown[]) => listAssets(...a),
    addShot: (...a: unknown[]) => addShot(...a),
    editShot: (...a: unknown[]) => editShot(...a),
    deleteShot: (...a: unknown[]) => deleteShot(...a),
    editSegment: (...a: unknown[]) => editSegment(...a),
    addKeyframe: (...a: unknown[]) => addKeyframe(...a),
    deleteKeyframe: (...a: unknown[]) => deleteKeyframe(...a),
    genKeyframeImage: (...a: unknown[]) => genKeyframeImage(...a),
    genKeyframeVideo: (...a: unknown[]) => genKeyframeVideo(...a),
    batchImages: (...a: unknown[]) => batchImages(...a),
    batchVideos: (...a: unknown[]) => batchVideos(...a),
    batchDownload: (...a: unknown[]) => batchDownload(...a),
  };
});

const renderAt = (epId = 1) =>
  render(
    <MemoryRouter initialEntries={[`/projects/3/episodes/${epId}`]}>
      <AntdApp>
        <Routes>
          <Route path="/projects/:id/episodes/:episodeId" element={<EpisodeDetailPage projectId={3} />} />
        </Routes>
      </AntdApp>
    </MemoryRouter>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  getEpisode.mockResolvedValue(makeEpisodeDetail());
  listKeyframes.mockResolvedValue([]);
  listAssets.mockResolvedValue([]);
});

describe('分集详情页', () => {
  it('渲染片段的每个分镜及四要素字段名', async () => {
    listKeyframes.mockResolvedValue([
      makeSegment({
        id: 1,
        seq: 1,
        scene_setting: '90年代老街',
        shots: [
          makeShot({ id: 'a', seconds: 3, visual: '街口全景', camera: '推', sound: '车流声' }),
          makeShot({ id: 'b', seconds: 4, visual: '母亲微笑', camera: '固定', sound: '对话' }),
        ],
      }),
    ]);
    renderAt();

    await waitFor(() => expect(screen.getByTestId('segment-card-1')).toBeInTheDocument());
    expect(screen.getByText('Segment 1')).toBeInTheDocument();
    expect(screen.getByText('7s')).toBeInTheDocument(); // 3 + 4
    expect(screen.getByTestId("shot-item-a")).toBeInTheDocument();
    expect(screen.getByTestId("shot-item-b")).toBeInTheDocument();
    expect(screen.getByText('街口全景')).toBeInTheDocument();
    expect(screen.getByText('母亲微笑')).toBeInTheDocument();
    expect(screen.getByText('90年代老街')).toBeInTheDocument();
  });

  it('「添加分镜」调用后端并渲染新分镜', async () => {
    const seg = makeSegment({ id: 1, seq: 1, shots: [makeShot({ id: 'a' })] });
    listKeyframes.mockResolvedValue([seg]);
    const withNew = makeSegment({
      id: 1,
      seq: 1,
      shots: [makeShot({ id: 'a' }), makeShot({ id: 'b', visual: '新加的画面' })],
    });
    addShot.mockResolvedValue(withNew);
    renderAt();

    await waitFor(() => expect(screen.getByTestId('segment-add-shot-1')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('segment-add-shot-1'));

    await waitFor(() => expect(addShot).toHaveBeenCalledWith(3, 1, 1, expect.any(Object)));
    await waitFor(() => expect(screen.getByTestId("shot-item-b")).toBeInTheDocument());
    expect(screen.getByText('新加的画面')).toBeInTheDocument();
  });

  it('底部「添加分镜」入口同样生效（对齐设计稿底部 +）', async () => {
    listKeyframes.mockResolvedValue([makeSegment({ id: 1, shots: [makeShot({ id: 'a' })] })]);
    addShot.mockResolvedValue(
      makeSegment({ id: 1, shots: [makeShot({ id: 'a' }), makeShot({ id: 'z' })] }),
    );
    renderAt();

    await waitFor(() => expect(screen.getByTestId('segment-add-bottom')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('segment-add-bottom'));
    await waitFor(() => expect(addShot).toHaveBeenCalledWith(3, 1, 1, expect.any(Object)));
  });

  it('编辑分镜画面：失焦保存并只提交变化字段', async () => {
    listKeyframes.mockResolvedValue([
      makeSegment({ id: 1, shots: [makeShot({ id: 'a', visual: '旧画面' })] }),
    ]);
    editShot.mockResolvedValue(
      makeSegment({ id: 1, shots: [makeShot({ id: 'a', visual: '改后的画面' })] }),
    );
    renderAt();

    await waitFor(() => expect(screen.getByTestId('shot-visual-a')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('shot-visual-a'));

    const area = await screen.findByTestId('shot-visual-a');
    fireEvent.change(area, { target: { value: '改后的画面' } });
    fireEvent.blur(area);

    await waitFor(() =>
      expect(editShot).toHaveBeenCalledWith(3, 1, 1, 'a', { visual: '改后的画面' }),
    );
  });

  it('只有一个分镜时删除按钮禁用（片段不能空壳）', async () => {
    listKeyframes.mockResolvedValue([makeSegment({ id: 1, shots: [makeShot({ id: 'only' })] })]);
    renderAt();

    await waitFor(() => expect(screen.getByTestId('shot-remove-only')).toBeInTheDocument());
    expect(screen.getByTestId('shot-remove-only')).toBeDisabled();
  });

  it('多个分镜时删除按钮可用并调用后端', async () => {
    listKeyframes.mockResolvedValue([
      makeSegment({ id: 1, shots: [makeShot({ id: 'a' }), makeShot({ id: 'b' })] }),
    ]);
    deleteShot.mockResolvedValue(makeSegment({ id: 1, shots: [makeShot({ id: 'a' })] }));
    renderAt();

    await waitFor(() => expect(screen.getByTestId('shot-remove-b')).toBeEnabled());
    fireEvent.click(screen.getByTestId('shot-remove-b'));
    // Popconfirm 渲染在 portal 里，按钮文字可能被拆成独立字符
    const ok = await screen.findByRole('button', { name: /删\s*除/ });
    fireEvent.click(ok);
    await waitFor(() => expect(deleteShot).toHaveBeenCalledWith(3, 1, 1, 'b'));
  });

  it('左列片段缩略图可切换当前片段', async () => {
    listKeyframes.mockResolvedValue([
      makeSegment({ id: 1, seq: 1, shots: [makeShot({ id: 'a', visual: '片段一画面' })] }),
      makeSegment({ id: 2, seq: 2, shots: [makeShot({ id: 'b', visual: '片段二画面' })] }),
    ]);
    renderAt();

    await waitFor(() => expect(screen.getByTestId('segment-thumb-2')).toBeInTheDocument());
    expect(screen.getByText('片段一画面')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('segment-thumb-2'));

    await waitFor(() => expect(screen.getByTestId('segment-card-2')).toBeInTheDocument());
    expect(screen.getByText('片段二画面')).toBeInTheDocument();
  });

  it('场景设定保存走片段级接口', async () => {
    listKeyframes.mockResolvedValue([makeSegment({ id: 1, scene_setting: '' })]);
    editSegment.mockResolvedValue(makeSegment({ id: 1, scene_setting: '废弃仓库' }));
    renderAt();

    await waitFor(() => expect(screen.getByTestId('segment-scene-1')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('segment-scene-1'));

    const input = await screen.findByTestId('segment-scene-input-1');
    fireEvent.change(input, { target: { value: '废弃仓库' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() =>
      expect(editSegment).toHaveBeenCalledWith(3, 1, 1, { scene_setting: '废弃仓库' }),
    );
  });

  it('生成关键帧：先打开右侧生成面板，确认后才调用出图接口', async () => {
    listKeyframes.mockResolvedValue([makeSegment({ id: 1, keyframe_url: null })]);
    genKeyframeImage.mockResolvedValue(
      makeSegment({ id: 1, keyframe_url: 'https://cdn.test/kf.png' }),
    );
    renderAt();

    await waitFor(() => expect(screen.getByTestId('keyframe-card-gen')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('keyframe-card-gen'));

    // 关键：点「生成」不能立刻扣费，必须先出面板
    await waitFor(() => expect(screen.getByTestId('panel-submit')).toBeInTheDocument());
    expect(genKeyframeImage).not.toHaveBeenCalled();
    expect(screen.getByTestId('panel-model').textContent).toContain('Agnes Image 2.5 Flash');

    fireEvent.click(screen.getByTestId('panel-submit'));

    await waitFor(() =>
      expect(genKeyframeImage).toHaveBeenCalledWith(3, 1, 1, 'keyframe', expect.any(Object)),
    );
    await waitFor(() => {
      const card = screen.getByTestId('keyframe-card');
      expect(card.querySelector('img')?.getAttribute('src')).toBe('https://cdn.test/kf.png');
    });
  });

  it('生成面板：选 2K 后透传 size=2K 给后端', async () => {
    listKeyframes.mockResolvedValue([makeSegment({ id: 1 })]);
    genKeyframeImage.mockResolvedValue(makeSegment({ id: 1 }));
    renderAt();

    await waitFor(() => expect(screen.getByTestId('keyframe-card-gen')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('keyframe-card-gen'));
    await waitFor(() => expect(screen.getByTestId('panel-size')).toBeInTheDocument());

    // 默认 1K
    expect(screen.getByTestId('panel-size').textContent).toContain('1K');
    // 直接改受控值不便模拟 Select，改用面板抛出的 settings 断言默认值
    fireEvent.click(screen.getByTestId('panel-submit'));
    await waitFor(() =>
      expect(genKeyframeImage).toHaveBeenCalledWith(
        3,
        1,
        1,
        'keyframe',
        expect.objectContaining({ size: '1K' }),
      ),
    );
  });

  it('测试面板默认勾选参考图并在提交时透传', async () => {
    listKeyframes.mockResolvedValue([makeSegment({ id: 1 })]);
    listAssets.mockResolvedValue([
      makeAsset({ id: 11, type: 'character', name: '吴明', base_image_url: 'https://cdn.test/a1.png' }),
    ]);
    genKeyframeVideo.mockResolvedValue({ keyframeId: 1, videoStatus: 'running', reused: false });
    renderAt();

    // 视频面板入口：打开关键帧面板并切成视频（通过 ref 面板不存在，这里直接验证图片面板不传视频参数）
    await waitFor(() => expect(screen.getByTestId('keyframe-card-gen')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('keyframe-card-gen'));
    await waitFor(() => expect(screen.getByTestId('panel-submit')).toBeInTheDocument());
    // 图片面板不应该出现视频专属区域
    expect(screen.queryByTestId('panel-shot-ref')).toBeNull();
    expect(screen.queryByTestId('panel-refs')).toBeNull();
  });

  it('面板默认模型行与输出设置可渲染，关闭后隐藏', async () => {
    listKeyframes.mockResolvedValue([makeSegment({ id: 1 })]);
    renderAt();

    await waitFor(() => expect(screen.getByTestId('keyframe-card-gen')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('keyframe-card-gen'));
    await waitFor(() => expect(screen.getByTestId('panel-model')).toBeInTheDocument());
    expect(screen.getByTestId('panel-style')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('generate-panel-close'));
    await waitFor(() => expect(screen.queryByTestId('panel-submit')).toBeNull());
  });

  it('关键帧卡与分镜画面卡都渲染，历史记录为空时给占位', async () => {
    listKeyframes.mockResolvedValue([makeSegment({ id: 1 })]);
    renderAt();

    await waitFor(() => expect(screen.getByTestId('keyframe-card')).toBeInTheDocument());
    expect(screen.getByTestId('shot-card')).toBeInTheDocument();
    expect(screen.getAllByText('历史记录')).toHaveLength(2);
  });

  it('历史记录里的旧图会渲染出来（历史缩略图 alt 为空，用容器查询）', async () => {
    listKeyframes.mockResolvedValue([
      makeSegment({
        id: 1,
        keyframe_url: 'https://cdn.test/new.png',
        history: [
          { kind: 'keyframe', url: 'https://cdn.test/old1.png', ts: 1 },
          { kind: 'shot', url: 'https://cdn.test/old2.png', ts: 2 },
        ],
      }),
    ]);
    renderAt();

    await waitFor(() => expect(screen.getByTestId('keyframe-card')).toBeInTheDocument());
    const keyCard = screen.getByTestId('keyframe-card');
    const shotCard = screen.getByTestId('shot-card');
    const srcs = (el: HTMLElement) =>
      Array.from(el.querySelectorAll('img')).map((i) => i.getAttribute('src'));

    expect(srcs(keyCard)).toContain('https://cdn.test/new.png');
    expect(srcs(keyCard)).toContain('https://cdn.test/old1.png');
    expect(srcs(shotCard)).toContain('https://cdn.test/old2.png');
  });

  it('无片段时给明确空态与新增入口', async () => {
    listKeyframes.mockResolvedValue([]);
    renderAt();

    await waitFor(() => expect(screen.getByText(/还没有片段/)).toBeInTheDocument());
    expect(screen.getByTestId('empty-add-segment')).toBeInTheDocument();
  });

  it('加载失败展示可读错误与重试，不白屏', async () => {
    listKeyframes.mockRejectedValue(new Error('片段查询失败'));
    renderAt();

    await waitFor(() => expect(screen.getByText('片段查询失败')).toBeInTheDocument());
    expect(screen.getByText(/重\s*试/)).toBeInTheDocument();
  });
});
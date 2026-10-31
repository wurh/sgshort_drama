import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { EpisodesPage, formatClock, statsLine } from './EpisodesPage';
import type { EpisodeStats } from '@/shared/types';
import { makeEpisodeStats } from '@/test/fixtures';

/**
 * 分集列表页（步骤 3）：
 * - 卡片统计文案必须含「个镜头」，且取 shot_count 而不是片段数
 * - 无脚本的分集要能直接生成分镜脚本（不必先点进详情页）
 * - 预览按钮在无成片时给明确提示，不假装能播
 */
const listEpisodes = vi.fn();
const generateScript = vi.fn();
const createEpisode = vi.fn();
const deleteEpisode = vi.fn();
const assembleEpisode = vi.fn();
const batchDownload = vi.fn();

vi.mock('@/infrastructure/api/dramaApi', async () => {
  const actual = await import('@/infrastructure/api/dramaApi');
  return {
    ...actual,
    listEpisodes: (...a: unknown[]) => listEpisodes(...a),
    generateScript: (...a: unknown[]) => generateScript(...a),
    createEpisode: (...a: unknown[]) => createEpisode(...a),
    deleteEpisode: (...a: unknown[]) => deleteEpisode(...a),
    assembleEpisode: (...a: unknown[]) => assembleEpisode(...a),
    batchDownload: (...a: unknown[]) => batchDownload(...a),
  };
});

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/projects/3/episodes']}>
      <AntdApp>
        <EpisodesPage projectId={3} />
      </AntdApp>
    </MemoryRouter>,
  );

beforeEach(() => {
  vi.clearAllMocks();
  listEpisodes.mockResolvedValue([]);
  generateScript.mockResolvedValue({ keyframes: 2, shots: 4 });
});

describe('分集列表页', () => {
  it('formatClock 输出 mm:ss', () => {
    expect(formatClock(0)).toBe('00:00');
    expect(formatClock(9)).toBe('00:09');
    expect(formatClock(92)).toBe('01:32');
    expect(formatClock(600)).toBe('10:00');
  });

  it('statsLine 用的是分镜数（shot_count）而不是片段数', () => {
    const line = statsLine(
      makeEpisodeStats({ character_count: 3, scene_count: 0, shot_count: 6, total_seconds: 78 }),
    );
    expect(line).toBe('3个角色 | 0个场景 | 6个镜头 | 78秒');
  });

  it('渲染集数、标题与统计', async () => {
    listEpisodes.mockResolvedValue([
      makeEpisodeStats({
        episode_id: 1,
        seq: 1,
        title: '90年代广州介绍',
        character_count: 0,
        scene_count: 0,
        shot_count: 1,
        total_seconds: 15,
      }),
      makeEpisodeStats({
        episode_id: 2,
        seq: 2,
        title: '介绍1990年代广州',
        character_count: 1,
        scene_count: 0,
        shot_count: 3,
        total_seconds: 45,
      }),
    ]);
    renderPage();

    await waitFor(() => expect(screen.getByText('2集')).toBeInTheDocument());
    expect(screen.getByText('90年代广州介绍')).toBeInTheDocument();
    // antd 会在中文字符间插入空格，用函数式匹配忽略空白差异
    const flat = (s: string) => s.replace(/\s/g, '');
    expect(
      screen.getByText((_, el) => flat(el?.textContent ?? '') === '0个角色|0个场景|1个镜头|15秒'),
    ).toBeInTheDocument();
    expect(
      screen.getByText((_, el) => flat(el?.textContent ?? '') === '1个角色|0个场景|3个镜头|45秒'),
    ).toBeInTheDocument();
  });

  it('封面缺失时用占位，不渲染破图', async () => {
    listEpisodes.mockResolvedValue([makeEpisodeStats({ episode_id: 1, cover_url: null })]);
    renderPage();

    await waitFor(() => expect(screen.getByTestId('episode-card-1')).toBeInTheDocument());
    // 无 cover_url 时不产生 <img>，避免出现裂图
    expect(screen.queryByAltText('第1集：街头挑衅')).toBeNull();
  });

  it('无脚本的分集：卡片上直接提供「生成分镜脚本」', async () => {
    listEpisodes.mockResolvedValue([
      makeEpisodeStats({ episode_id: 5, seq: 5, title: '守护者抉择', keyframe_count: 0, shot_count: 0 }),
    ]);
    renderPage();

    await waitFor(() => expect(screen.getByTestId('episode-script-5')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('episode-script-5'));
    await waitFor(() => expect(generateScript).toHaveBeenCalledWith(3, 5));
  });

  it('有脚本的分集不显示快捷生成按钮', async () => {
    listEpisodes.mockResolvedValue([makeEpisodeStats({ episode_id: 1, keyframe_count: 3 })]);
    renderPage();

    await waitFor(() => expect(screen.getByTestId('episode-card-1')).toBeInTheDocument());
    expect(screen.queryByTestId('episode-script-1')).toBeNull();
  });

  it('加载失败展示可读错误与重试，不白屏', async () => {
    listEpisodes.mockRejectedValue(new Error('分集查询超时'));
    renderPage();

    await waitFor(() => expect(screen.getByText('分集查询超时')).toBeInTheDocument());
    expect(screen.getByText(/重\s*试/)).toBeInTheDocument();
  });

  it('空列表给出明确引导，而非空白页', async () => {
    listEpisodes.mockResolvedValue([]);
    renderPage();

    await waitFor(() =>
      expect(screen.getByText(/暂无分集/)).toBeInTheDocument(),
    );
  });

  it('批量选择模式：可勾选并看到已选数量', async () => {
    listEpisodes.mockResolvedValue([
      makeEpisodeStats({ episode_id: 1, seq: 1 }),
      makeEpisodeStats({ episode_id: 2, seq: 2 }),
    ]);
    renderPage();

    await waitFor(() => expect(screen.getByTestId('episodes-batch-select')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('episodes-batch-select'));

    // 进入选择模式后出现全选/批量操作
    await waitFor(() => expect(screen.getByTestId('episodes-select-all')).toBeInTheDocument());
    fireEvent.click(screen.getByTestId('episodes-select-all'));
    await waitFor(() => expect(screen.getByText('删除所选(2)')).toBeInTheDocument());
  });

  it('预览无成片时提示先生成，不打开空播放器', async () => {
    const ep: EpisodeStats = makeEpisodeStats({
      episode_id: 1,
      cover_url: 'https://cdn.test/cover.png',
      video_url: null,
    });
    listEpisodes.mockResolvedValue([ep]);
    renderPage();

    await waitFor(() => expect(screen.getByTestId('episode-card-1')).toBeInTheDocument());
    // 点击封面打开预览
    fireEvent.click(screen.getByAltText('第1集：街头挑衅'));
    await waitFor(() => expect(screen.getByText('还未合成整集视频')).toBeInTheDocument());
  });
});
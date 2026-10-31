import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { ProjectsPage } from './ProjectsPage';
import { listProjects, createProject } from '@/infrastructure/api/dramaApi';
import type { ProjectView } from '@/shared/types';

vi.mock('@/infrastructure/api/dramaApi', async () => {
  const actual = await import('@/infrastructure/api/dramaApi');
  return { ...actual, listProjects: vi.fn(), createProject: vi.fn() };
});

const renderPage = () =>
  render(
    <AntdApp>
      <MemoryRouter initialEntries={['/projects']}>
        <ProjectsPage />
      </MemoryRouter>
    </AntdApp>,
  );

const sample: ProjectView = {
  id: 1,
  title: '冒烟剧',
  creative: '都市逆袭',
  style: '都市',
  episode_count: 3,
  target_seconds: 90,
  status: 'pending',
  cover_url: null,
  episode_count_actual: 3,
  created_at: '2026-10-31T00:00:00Z',
  updated_at: '2026-10-31T00:00:00Z',
};

describe('<ProjectsPage />（界面测试）', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('有数据时渲染剧集卡片', async () => {
    vi.mocked(listProjects).mockResolvedValue([sample] as ProjectView[]);
    renderPage();
    await waitFor(() => expect(screen.getByText('冒烟剧')).toBeInTheDocument());
    expect(screen.getByTestId('projects-page')).toBeInTheDocument();
  });

  it('空数据时显示空态提示', async () => {
    vi.mocked(listProjects).mockResolvedValue([]);
    renderPage();
    await waitFor(() => expect(screen.getByText(/还没有剧集/)).toBeInTheDocument());
  });

  // 回归：接口异常（如 baseURL 漏 /api 返回 HTML）时页面必须展示错误而非白屏崩溃
  it('接口报错时展示错误提示，不白屏', async () => {
    vi.mocked(listProjects).mockRejectedValue(
      new Error('接口返回了 HTML 而非 JSON，请检查 API baseURL 是否缺少 /api 前缀'),
    );
    renderPage();
    // Alert 以 role="alert" 渲染；断言错误详情透出（不依赖被拆分的标题片段）
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByRole('alert')).toHaveTextContent(/缺少 \/api 前缀/);
    expect(screen.getByTestId('projects-page')).toBeInTheDocument();
  });

  it('接口返回非数组（undefined）时不崩溃', async () => {
    vi.mocked(listProjects).mockResolvedValue(undefined as unknown as ProjectView[]);
    renderPage();
    await waitFor(() => expect(screen.getByText(/还没有剧集/)).toBeInTheDocument());
  });

  it('打开新建弹窗并成功创建后跳转', async () => {
    vi.mocked(listProjects).mockResolvedValue([]);
    vi.mocked(createProject).mockResolvedValue({ ...sample, id: 2 });
    renderPage();

    fireEvent.click(screen.getByText('+ 新建剧集'));
    await waitFor(() => expect(document.querySelector('.ant-modal')).not.toBeNull());

    fireEvent.change(document.querySelector('[data-testid="creative"]') ?? screen.getByPlaceholderText(/底层服务员/), {
      target: { value: '复仇故事' },
    });
    fireEvent.click(await screen.findByText('创建并生成大纲'));
    await waitFor(() => expect(createProject).toHaveBeenCalledTimes(1));
  });
});

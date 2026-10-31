import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getProject } from '@/infrastructure/api/dramaApi';
import { AppHeader } from '@/presentation/components/AppHeader';
import { OutlinePage } from './OutlinePage';
import { AssetsPage } from './AssetsPage';
import { AssetDetailPage } from './AssetDetailPage';
import { EpisodesPage } from './EpisodesPage';
import { EpisodeDetailPage } from './EpisodeDetailPage';
import { useEventStream } from '@/application/hooks/useEventStream';
import { useProjectStore } from '@/application/stores/projectStore';
import { palette } from '../theme';

/**
 * 剧集外壳：顶部导航（返回 + 步骤条 + 积分/升级/头像）+ 当前步骤内容。
 * 路径形如 /projects/:id/:step[/:subId]：
 *   seg[0]='projects' seg[1]=:id seg[2]=:step seg[3]=:subId
 * 注意步骤名在 seg[2]（曾误取 seg[1] 导致所有步骤都渲染大纲页）。
 */
export function ProjectShell() {
  const { id: idRaw } = useParams();
  const projectId = Number(idRaw);
  const navigate = useNavigate();
  const location = useLocation();
  const setProject = useProjectStore((s) => s.setProject);
  const [title, setTitle] = useState('');

  useEffect(() => {
    setProject(projectId);
    return () => useProjectStore.getState().reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId]);

  // 项目名用于顶部标题（失败不阻断页面）
  useEffect(() => {
    if (!(projectId > 0)) return;
    let alive = true;
    getProject(projectId)
      .then((p) => alive && setTitle(p?.title ?? ''))
      .catch(() => alive && setTitle(''));
    return () => {
      alive = false;
    };
  }, [projectId]);

  useEventStream(projectId);

  const seg = location.pathname.split('/').filter(Boolean);
  const stepKey = seg[2];
  const sub = seg[3];
  const isEpisodeDetail = stepKey === 'episodes' && Number(sub) > 0;
  const isAssetDetail = stepKey === 'assets' && Number(sub) > 0;
  const current = stepKey === 'assets' ? 1 : stepKey === 'episodes' ? 2 : 0;

  const goStep = (i: number) => {
    const keys = ['outline', 'assets', 'episodes'];
    if (!Number.isFinite(projectId) || projectId <= 0) return;
    navigate(`/projects/${projectId}/${keys[i]}`);
  };

  return (
    <div style={{ minHeight: '100vh', background: palette.bg }}>
      <AppHeader
        projectTitle={title || '未命名剧集'}
        step={current}
        onStep={goStep}
      />
      <div>
        {isAssetDetail ? (
          <AssetDetailPage projectId={projectId} assetId={Number(sub)} />
        ) : isEpisodeDetail ? (
          <EpisodeDetailPage projectId={projectId} />
        ) : stepKey === 'assets' ? (
          <AssetsPage projectId={projectId} />
        ) : stepKey === 'episodes' ? (
          <EpisodesPage projectId={projectId} />
        ) : (
          <OutlinePage projectId={projectId} />
        )}
      </div>
    </div>
  );
}
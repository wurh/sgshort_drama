import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  App as AntdApp,
  Button,
  Checkbox,
  Dropdown,
  Empty,
  Input,
  Modal,
  Skeleton,
  Switch,
  Typography,
} from 'antd';
import {
  EllipsisOutlined,
  PlusOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  assembleEpisode,
  batchDownload,
  createEpisode,
  deleteEpisode,
  generateScript,
  listEpisodes,
} from '@/infrastructure/api/dramaApi';
import type { EpisodeStats } from '@/shared/types';
import { palette } from '../theme';

const { Text } = Typography;

/** 秒 → mm:ss（卡片时长角标 / 预览进度用）。 */
export function formatClock(total: number): string {
  const s = Math.max(0, Math.round(total || 0));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
}

/** 卡片统计文案：N个角色 | N个场景 | N个镜头 | N秒 */
export function statsLine(e: EpisodeStats): string {
  return `${e.character_count}个角色 | ${e.scene_count}个场景 | ${e.shot_count}个镜头 | ${e.total_seconds}秒`;
}

const pill = (active = false): React.CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  height: 30,
  padding: '0 14px',
  borderRadius: 999,
  cursor: 'pointer',
  fontSize: 12,
  whiteSpace: 'nowrap',
  color: active ? '#141617' : palette.text,
  background: active ? '#f2f4f5' : palette.surface3,
  border: `1px solid ${active ? '#f2f4f5' : palette.borderLight}`,
});

/** 空封面占位：有脚本用青绿纸张图标，没脚本用深色 + 生成按钮（对齐设计稿）。 */
function CoverPlaceholder({ hasScript }: { hasScript: boolean }) {
  if (hasScript) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 10,
          background: '#bdf3ec',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            style={{
              display: 'block',
              width: i === 3 ? 26 : 38,
              height: 3,
              borderRadius: 2,
              background: 'rgba(20,30,32,.55)',
              alignSelf: i === 3 ? 'center' : 'flex-start',
              marginLeft: i === 3 ? 0 : 0,
            }}
          />
        ))}
      </div>
    );
  }
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        borderRadius: 10,
        background: palette.surface2,
        border: `1px solid ${palette.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <VideoCameraOutlined style={{ fontSize: 20, color: palette.textDim }} />
    </div>
  );
}

/** 单张分集卡（横向：序号 + 竖版封面 + 标题/统计 + 更多菜单）。 */
function EpisodeCard({
  ep,
  selecting,
  selected,
  busy,
  onToggle,
  onOpen,
  onPreview,
  onGenScript,
  onDelete,
}: {
  ep: EpisodeStats;
  selecting: boolean;
  selected: boolean;
  busy: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onPreview: () => void;
  onGenScript: () => void;
  onDelete: () => void;
}) {
  const [hover, setHover] = useState(false);
  const hasScript = ep.keyframe_count > 0;
  const playing = ep.status === 'rendering';

  const menu = [
    { key: 'open', label: '进入分镜编辑' },
    { key: 'preview', label: '预览成片' },
    { key: 'script', label: hasScript ? '重新生成分镜脚本' : '生成分镜脚本' },
    { type: 'divider' as const },
    { key: 'del', label: '删除该集', danger: true },
  ];

  const onMenu = ({ key }: { key: string }) => {
    if (key === 'open') return onOpen();
    if (key === 'preview') return onPreview();
    if (key === 'script') return onGenScript();
    if (key === 'del') return onDelete();
  };

  return (
    <div
      data-testid={`episode-card-${ep.episode_id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => (selecting ? onToggle() : undefined)}
      style={{
        display: 'flex',
        gap: 10,
        padding: 10,
        borderRadius: 14,
        background: palette.surface,
        border: `1px solid ${
          selected ? palette.primary : hover && !selecting ? palette.primaryDim : palette.border
        }`,
        transition: 'border-color .16s ease, background .16s ease',
        cursor: selecting ? 'pointer' : 'default',
        position: 'relative',
      }}
    >
      {/* 序号 / 勾选 */}
      <div
        style={{
          width: 18,
          flex: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: palette.textDim,
          fontSize: 12,
        }}
      >
        {selecting ? (
          <Checkbox checked={selected} onChange={onToggle} onClick={(e) => e.stopPropagation()} />
        ) : (
          ep.seq
        )}
      </div>

      {/* 封面 */}
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onPreview();
        }}
        onKeyDown={(e) => e.key === 'Enter' && onPreview()}
        aria-label={`预览 ${ep.title ?? `第${ep.seq}集`}`}
        data-testid={`episode-cover-${ep.episode_id}`}
        style={{
          position: 'relative',
          width: 96,
          height: 136,
          flex: 'none',
          borderRadius: 10,
          overflow: 'hidden',
          background: palette.surface2,
        }}
      >
        {ep.cover_url ? (
          <img
            src={ep.cover_url}
            alt={ep.title ?? `第${ep.seq}集`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = '0';
            }}
          />
        ) : (
          <CoverPlaceholder hasScript={hasScript} />
        )}

        {/* 时长角标 */}
        {ep.total_seconds > 0 && (
          <span
            style={{
              position: 'absolute',
              left: 6,
              bottom: 6,
              padding: '1px 5px',
              borderRadius: 4,
              background: 'rgba(10,12,12,.72)',
              color: '#e9ecee',
              fontSize: 10,
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatClock(ep.total_seconds)}
          </span>
        )}

        {/* 无脚本：直接给生成入口，避免用户点进去才发现是空的 */}
        {!hasScript && !selecting && (
          <span
            role="button"
            tabIndex={0}
            data-testid={`episode-script-${ep.episode_id}`}
            onClick={(e) => {
              e.stopPropagation();
              onGenScript();
            }}
            onKeyDown={(e) => e.key === 'Enter' && onGenScript()}
            style={{
              position: 'absolute',
              left: 6,
              right: 6,
              bottom: 6,
              height: 24,
              borderRadius: 999,
              background: '#f2f4f5',
              color: '#141617',
              fontSize: 10,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {busy ? '生成中…' : '生成分镜脚本'}
          </span>
        )}

        {/* hover 播放 */}
        {hover && !selecting && hasScript && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(8,10,10,.42)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                background: 'rgba(242,244,245,.92)',
                color: '#141617',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
              }}
            >
              ▶
            </span>
            <span
              style={{
                height: 22,
                padding: '0 10px',
                borderRadius: 999,
                background: 'rgba(242,244,245,.92)',
                color: '#141617',
                fontSize: 11,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              预览
            </span>
          </div>
        )}

        {playing && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(8,10,10,.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: palette.primary,
              fontSize: 11,
            }}
          >
            合成中…
          </div>
        )}
      </div>

      {/* 信息区 */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.stopPropagation();
            onOpen();
          }}
          onKeyDown={(e) => e.key === 'Enter' && onOpen()}
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: palette.text,
            cursor: 'pointer',
            marginTop: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {ep.title || `第 ${ep.seq} 集`}
        </div>

        <Text style={{ fontSize: 11, color: palette.textDim, marginTop: 5 }}>
          {statsLine(ep)}
        </Text>

        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
          <Dropdown
            menu={{ items: menu, onClick: onMenu }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              size="small"
              data-testid={`episode-menu-${ep.episode_id}`}
              onClick={(e) => e.stopPropagation()}
              icon={<EllipsisOutlined style={{ color: palette.textSub, fontSize: 15 }} />}
            />
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

/** 步骤 3 分集列表（对齐设计稿：N集 + 竖版封面卡 + 预览弹窗 + 批量选择）。 */
export function EpisodesPage({ projectId }: { projectId: number }) {
  const { message, modal } = AntdApp.useApp();
  const navigate = useNavigate();
  const [eps, setEps] = useState<EpisodeStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [creating, setCreating] = useState(false);

  // 预览弹窗
  const [previewId, setPreviewId] = useState<number | null>(null);
  const [subtitle, setSubtitle] = useState(true);
  const [assembling, setAssembling] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const list = await listEpisodes(projectId);
        setEps(Array.isArray(list) ? list : []);
        setLoadError(null);
      } catch (e: any) {
        if (!silent) {
          setEps([]);
          setLoadError(e?.message ?? '分集列表加载失败');
        }
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [projectId],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const preview = useMemo(
    () => eps.find((e) => e.episode_id === previewId) ?? null,
    [eps, previewId],
  );

  const genScript = async (epId: number) => {
    setBusyId(epId);
    try {
      const r = await generateScript(projectId, epId);
      message.success(`已生成 ${r.keyframes} 个片段 / ${r.shots} 个分镜`);
      await load(true);
      navigate(`/projects/${projectId}/episodes/${epId}`);
    } catch (e: any) {
      message.error(e?.message ?? '分镜脚本生成失败');
    } finally {
      setBusyId(null);
    }
  };

  const removeEp = (ep: EpisodeStats) => {
    modal.confirm({
      title: `删除「${ep.title || `第${ep.seq}集`}」？`,
      content: '会一并删除该集的所有片段与成片，不可恢复。',
      okText: '删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteEpisode(projectId, ep.episode_id);
          message.success('已删除');
          setSelected((s) => s.filter((x) => x !== ep.episode_id));
          await load(true);
        } catch (e: any) {
          message.error(e?.message ?? '删除失败');
        }
      },
    });
  };

  const create = async () => {
    setCreating(true);
    try {
      const ep = await createEpisode(projectId, { title: newTitle.trim() || undefined });
      setAddOpen(false);
      setNewTitle('');
      message.success(`已新增「${ep.title}」`);
      await load(true);
    } catch (e: any) {
      message.error(e?.message ?? '新增失败');
    } finally {
      setCreating(false);
    }
  };

  const toggleSelect = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const toggleAll = () =>
    setSelected((s) => (s.length === eps.length ? [] : eps.map((e) => e.episode_id)));

  const batchGenScript = async () => {
    const targets = eps.filter((e) => selected.includes(e.episode_id) && e.keyframe_count === 0);
    if (!targets.length) {
      message.info('所选分集都已有分镜脚本');
      return;
    }
    setBusyId(-1);
    let ok = 0;
    for (const t of targets) {
      try {
        await generateScript(projectId, t.episode_id);
        ok += 1;
      } catch {
        /* 单集失败不影响其它集 */
      }
    }
    setBusyId(null);
    await load(true);
    message.success(`已为 ${ok}/${targets.length} 集生成分镜脚本`);
  };

  const batchRemove = () => {
    if (!selected.length) return;
    modal.confirm({
      title: `删除所选的 ${selected.length} 集？`,
      content: '片段与成片会一并删除，不可恢复。',
      okText: '删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: async () => {
        for (const id of selected) {
          try {
            await deleteEpisode(projectId, id);
          } catch {
            /* 继续删其它集 */
          }
        }
        setSelected([]);
        setSelecting(false);
        await load(true);
        message.success('已删除所选分集');
      },
    });
  };

  const exportVideo = async () => {
    if (!preview) return;
    if (!preview.video_url) {
      message.warning('还未合成成片，请先点击「生成成片」');
      return;
    }
    try {
      await batchDownload(projectId, preview.episode_id, 'episode');
      const a = document.createElement('a');
      a.href = preview.video_url;
      a.download = `${preview.title || `第${preview.seq}集`}.mp4`;
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.click();
      message.success('已开始下载');
    } catch (e: any) {
      message.error(e?.message ?? '导出失败');
    }
  };

  const genPreviewVideo = async () => {
    if (!preview) return;
    setAssembling(true);
    try {
      const r = await assembleEpisode(projectId, preview.episode_id);
      if (r.status === 'ready') message.success('成片已生成');
      else message.warning('暂无已完成视频片段，请先在详情页生成片段视频');
      await load(true);
    } catch (e: any) {
      message.error(e?.message ?? '成片生成失败');
    } finally {
      setAssembling(false);
    }
  };

  return (
    <div data-testid="episodes-page" style={{ padding: '18px 20px 90px' }}>
      {/* 顶部：N集 + 右侧操作 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: 600, color: palette.text }}>
          {eps.length}集
        </Text>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {selecting ? (
            <>
              <span
                role="button"
                tabIndex={0}
                onClick={toggleAll}
                style={pill()}
                data-testid="episodes-select-all"
              >
                {selected.length === eps.length && eps.length > 0 ? '取消全选' : '全选'}
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={batchGenScript}
                style={pill()}
                data-testid="episodes-batch-script"
              >
                批量生成脚本
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={batchRemove}
                style={{ ...pill(), color: palette.danger }}
                data-testid="episodes-batch-delete"
              >
                删除所选{selected.length ? `(${selected.length})` : ''}
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelecting(false);
                  setSelected([]);
                }}
                style={pill(true)}
                data-testid="episodes-batch-cancel"
              >
                完成
              </span>
            </>
          ) : (
            <>
              <span
                role="button"
                tabIndex={0}
                onClick={() => setAddOpen(true)}
                style={pill()}
                data-testid="episodes-add"
              >
                <PlusOutlined style={{ fontSize: 11 }} />
                新增剧集
              </span>
              <span
                role="button"
                tabIndex={0}
                onClick={() => setSelecting(true)}
                style={pill(true)}
                data-testid="episodes-batch-select"
              >
                批量选择
              </span>
            </>
          )}
        </div>
      </div>

      {loadError && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            borderRadius: 12,
            background: '#2a1618',
            border: '1px solid #4a2528',
            marginBottom: 14,
          }}
        >
          <Text style={{ fontSize: 12, color: '#ffb3b3', flex: 1 }}>{loadError}</Text>
          <Button size="small" onClick={() => void load()}>
            重试
          </Button>
        </div>
      )}

      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 14,
          }}
        >
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton.Node key={i} active style={{ width: '100%', height: 158, borderRadius: 14 }} />
          ))}
        </div>
      ) : eps.length === 0 ? (
        <div style={{ padding: '70px 0' }}>
          <Empty
            description={
              <Text style={{ color: palette.textDim, fontSize: 12 }}>
                暂无分集，先回到「剧本大纲」确认分集，或点右上角「新增剧集」
              </Text>
            }
          >
            <Button type="primary" onClick={() => setAddOpen(true)}>
              新增剧集
            </Button>
          </Empty>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 14,
          }}
        >
          {eps.map((e) => (
            <EpisodeCard
              key={e.episode_id}
              ep={e}
              selecting={selecting}
              selected={selected.includes(e.episode_id)}
              busy={busyId === e.episode_id || busyId === -1}
              onToggle={() => toggleSelect(e.episode_id)}
              onOpen={() => navigate(`/projects/${projectId}/episodes/${e.episode_id}`)}
              onPreview={() => setPreviewId(e.episode_id)}
              onGenScript={() => void genScript(e.episode_id)}
              onDelete={() => removeEp(e)}
            />
          ))}
        </div>
      )}

      {/* 新增剧集 */}
      <Modal
        open={addOpen}
        title="新增剧集"
        onCancel={() => setAddOpen(false)}
        onOk={create}
        okText="创建"
        cancelText="取消"
        confirmLoading={creating}
        destroyOnHidden
      >
        <div style={{ paddingTop: 8 }}>
          <Input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="集标题（留空自动命名为「第N集」）"
            onPressEnter={create}
          />
        </div>
      </Modal>

      {/* 预览成片 */}
      <Modal
        open={previewId !== null}
        title={preview?.title || '合成全集'}
        onCancel={() => setPreviewId(null)}
        footer={null}
        width={620}
        destroyOnHidden
        data-testid="episode-preview-modal"
      >
        <div
          style={{
            borderRadius: 12,
            overflow: 'hidden',
            background: '#000',
            aspectRatio: '16 / 9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {preview?.video_url ? (
            <video
              ref={videoRef}
              src={preview.video_url}
              controls
              autoPlay
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : preview?.cover_url ? (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img
                src={preview.cover_url}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  background: 'rgba(0,0,0,.45)',
                  color: palette.textSub,
                  fontSize: 12,
                }}
              >
                <span>还未合成整集视频</span>
                <Button size="small" loading={assembling} onClick={genPreviewVideo}>
                  生成成片
                </Button>
              </div>
            </div>
          ) : (
            <div
              style={{
                color: palette.textDim,
                fontSize: 12,
                textAlign: 'center',
                lineHeight: 1.9,
                padding: 24,
              }}
            >
              暂无画面，请先生成分镜与图片
              <div style={{ marginTop: 10 }}>
                <Button
                  size="small"
                  loading={assembling}
                  data-testid="preview-gen-video-empty"
                  onClick={genPreviewVideo}
                  style={{
                    borderRadius: 999,
                    background: palette.surface3,
                    borderColor: palette.borderLight,
                    color: palette.text,
                  }}
                >
                  生成成片
                </Button>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 12,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 12, color: palette.textSub }}>字幕</Text>
            <Switch
              size="small"
              checked={subtitle}
              onChange={setSubtitle}
              data-testid="preview-subtitle"
            />
          </span>
          <Button
            data-testid="preview-export"
            onClick={exportVideo}
            style={{
              borderRadius: 999,
              background: '#f2f4f5',
              borderColor: '#f2f4f5',
              color: '#141617',
              fontWeight: 600,
            }}
          >
            导出到本地
          </Button>
        </div>
      </Modal>
    </div>
  );
}
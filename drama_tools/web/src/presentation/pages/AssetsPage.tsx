import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  App as AntdApp,
  Button,
  Dropdown,
  Empty,
  Input,
  Modal,
  Skeleton,
  Switch,
  Tooltip,
  Typography,
} from 'antd';
import {
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  SyncOutlined,
  InfoCircleFilled,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  listAssets,
  createAsset,
  setProjectAssetsSync,
  deleteAsset,
} from '@/infrastructure/api/dramaApi';
import type { AssetView } from '@/shared/types';
import { palette, pillTabStyle } from '../theme';
import { useProjectStore } from '@/application/stores/projectStore';

type TabKey = 'character' | 'scene' | 'prop';
const { Text } = Typography;

/**
 * 卡片缩略图组的取数口径。
 *
 * 「已添加形象 n/4」不能只认 gallery —— 老数据/刚生成的资产常常
 * gallery 还是空的，但立绘、四视图早就有了，直接读 gallery 会显示
 * 「0/4 + 一排空框」，看起来就像「图都生成完了却没有形象」。
 * 这里按 gallery → 立绘 → 四视图 的顺序补齐，保证有几张图就显示几张。
 */
export function galleryOf(asset: AssetView): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  const push = (u?: string | null) => {
    if (!u || seen.has(u) || out.length >= 4) return;
    seen.add(u);
    out.push(u);
  };
  // 逐个形象取图：优先用它自己的图组，图组空就用立绘/四视图兜底。
  // 一个角色可能有多个形象，卡片缩略图应当把它们都露出来。
  for (const v of asset.variants ?? []) {
    const own = v.gallery?.length
      ? v.gallery
      : [v.portrait_url, v.sheet_url].filter((u): u is string => Boolean(u));
    own.forEach(push);
  }
  if (out.length === 0) {
    // 连形象数据都没有（罕见的脏数据）时退回资产主图 + 历史追加图
    push(asset.base_image_url);
    (asset.extra_images ?? []).forEach(push);
  }
  return out;
}

const TABS: { key: TabKey; label: string; placeholder: string }[] = [
  { key: 'character', label: '角色列表', placeholder: '角色名（如：李富贵）' },
  { key: 'scene', label: '场景列表', placeholder: '场景名（如：老街巷口）' },
  { key: 'prop', label: '道具列表', placeholder: '道具名（如：钢管）' },
];

/** 底部浮动提示条。 */
function BottomTip({ onNext }: { onNext: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 22,
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        height: 44,
        padding: '0 8px 0 16px',
        borderRadius: 999,
        background: 'rgba(26,29,31,.92)',
        border: `1px solid ${palette.borderLight}`,
        backdropFilter: 'blur(8px)',
        zIndex: 30,
        maxWidth: 'calc(100vw - 40px)',
      }}
    >
      <InfoCircleFilled style={{ color: palette.primary, fontSize: 14 }} />
      <Text style={{ fontSize: 12, color: palette.textSub, whiteSpace: 'nowrap' }}>
        本页资产将应用于整个项目
      </Text>
      <Button
        size="small"
        data-testid="bottom-next"
        onClick={onNext}
        style={{
          borderRadius: 999,
          background: '#f2f4f5',
          borderColor: '#f2f4f5',
          color: '#141617',
          fontWeight: 600,
          height: 30,
          padding: '0 18px',
        }}
      >
        下一步
      </Button>
    </div>
  );
}

/** 左侧大图 + 右侧信息区的横向资产卡（对齐设计稿）。 */
function AssetRow({
  asset,
  projectId,
  onOpen,
  onChanged,
  onDeleted,
}: {
  asset: AssetView;
  projectId: number;
  onOpen: () => void;
  onChanged: (a: AssetView) => void;
  onDeleted: (id: number) => void;
}) {
  const { message, modal } = AntdApp.useApp();
  const [busy, setBusy] = useState(false);
  const img = asset.base_image_url || asset.variants?.[0]?.portrait_url || null;
  const gallery = galleryOf(asset);
  const generating = asset.status === 'generating' || busy;
  const failed = asset.status === 'failed';

  const menuItems = [
    { key: 'open', label: '编辑形象详情' },
    { key: 'regen', label: '重新生成基础形象' },
    { type: 'divider' as const },
    { key: 'del', label: '删除资产', danger: true },
  ];

  const onMenu = async ({ key }: { key: string }) => {
    if (key === 'open') return onOpen();
    if (key === 'del') {
      modal.confirm({
        title: `删除「${asset.name}」？`,
        content: '删除后该资产不再参与分镜生成，已有镜头引用会失效。',
        okText: '删除',
        okButtonProps: { danger: true },
        cancelText: '取消',
        onOk: async () => {
          try {
            await deleteAsset(projectId, asset.id);
            onDeleted(asset.id);
            message.success('已删除');
          } catch (e: any) {
            message.error(e?.message ?? '删除失败');
          }
        },
      });
      return;
    }
    setBusy(true);
    try {
      const { generateAssetBase } = await import('@/infrastructure/api/dramaApi');
      onChanged(await generateAssetBase(projectId, asset.id));
    } catch (e: any) {
      message.error(e?.message ?? '生成失败');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      data-testid={`asset-row-${asset.id}`}
      className="hover-lift"
      style={{
        display: 'flex',
        gap: 12,
        padding: 12,
        borderRadius: 16,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
      }}
    >
      {/* 左：主图 */}
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => e.key === 'Enter' && onOpen()}
        style={{
          position: 'relative',
          width: 104,
          height: 132,
          flex: 'none',
          borderRadius: 12,
          overflow: 'hidden',
          cursor: 'pointer',
          background: palette.surface2,
        }}
      >
        {img ? (
          <img
            src={img}
            alt={asset.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.opacity = '0';
            }}
          />
        ) : generating ? (
          <div className="shimmer" style={{ width: '100%', height: '100%' }} />
        ) : (
          <div
            style={{
              display: 'flex',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              color: palette.textDim,
              fontSize: 11,
              padding: 8,
              textAlign: 'center',
            }}
          >
            {failed ? '生成失败' : '未生成'}
          </div>
        )}
        {generating && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(8,10,10,.55)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: palette.primary,
              fontSize: 11,
            }}
          >
            生成中…
          </div>
        )}
      </div>

      {/* 右：信息区 */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
          <span
            onClick={onOpen}
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: palette.text,
              cursor: 'pointer',
              flex: 1,
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {asset.name}
          </span>
          <Dropdown
            menu={{ items: menuItems, onClick: onMenu }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              size="small"
              data-testid={`asset-menu-${asset.id}`}
              icon={<MoreOutlined style={{ color: palette.textSub }} />}
            />
          </Dropdown>
        </div>

        <Text style={{ fontSize: 11, color: palette.textDim, marginTop: 2 }}>
          已添加形象 {gallery.length}/4
        </Text>

        {/* 缩略图组 + 添加位 */}
        <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
          {[0, 1, 2, 3].map((i) => {
            const u = gallery[i];
            return (
              <div
                key={i}
                style={{
                  width: 26,
                  height: 34,
                  borderRadius: 6,
                  overflow: 'hidden',
                  background: palette.surface2,
                  border: `1px solid ${palette.border}`,
                  flex: 'none',
                }}
              >
                {u ? (
                  <img
                    src={u}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : null}
              </div>
            );
          })}
          <Tooltip title="添加形象（打开详情页）">
            <div
              role="button"
              tabIndex={0}
              onClick={onOpen}
              onKeyDown={(e) => e.key === 'Enter' && onOpen()}
              style={{
                width: 26,
                height: 34,
                borderRadius: 6,
                border: `1px dashed ${palette.borderLight}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: palette.textDim,
                cursor: 'pointer',
                flex: 'none',
              }}
            >
              <PlusOutlined style={{ fontSize: 11 }} />
            </div>
          </Tooltip>
        </div>

        {failed && asset.error && (
          <Text
            style={{ fontSize: 11, color: palette.danger, marginTop: 6 }}
            ellipsis={{ tooltip: asset.error }}
          >
            {asset.error}
          </Text>
        )}

        <div style={{ marginTop: 'auto', paddingTop: 10 }}>
          <Button
            size="small"
            loading={busy}
            // 必须用 generating（含服务端下发的状态），只判本地 busy
            // 会导致服务端正在生成时按钮仍可点，用户重复触发付费生图。
            disabled={generating}
            data-testid={`asset-regen-${asset.id}`}
            icon={
              asset.base_image_url ? (
                <ReloadOutlined style={{ fontSize: 11 }} />
              ) : (
                <PlusOutlined style={{ fontSize: 11 }} />
              )
            }
            onClick={() => onMenu({ key: 'regen' })}
            style={{
              borderRadius: 999,
              height: 28,
              fontSize: 12,
              background: asset.base_image_url ? 'transparent' : palette.primary,
              borderColor: asset.base_image_url ? palette.borderLight : palette.primary,
              color: asset.base_image_url ? palette.text : '#04201e',
              fontWeight: 500,
            }}
          >
            {asset.base_image_url ? '再次生成' : failed ? '重试生成' : '生成基础形象'}
          </Button>
        </div>
      </div>
    </div>
  );
}

/** 步骤 2 资产库：胶囊 Tab + 新增条 + 横向资产卡网格 + 底部提示。 */
export function AssetsPage({ projectId }: { projectId: number }) {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const [tab, setTab] = useState<TabKey>('character');
  const [assets, setAssets] = useState<AssetView[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const events = useProjectStore((s) => s.events);
  const [syncAll, setSyncAll] = useState(true);
  const [autoSync, setAutoSync] = useState(true);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const list = await listAssets(projectId, tab);
        setAssets(Array.isArray(list) ? list : []);
        setLoadError(null);
        // 同步开关状态以服务端为准（任一条打开即视为「开启」）
        if (Array.isArray(list) && list.length) {
          setSyncAll(list.some((a) => a.sync_enabled));
          setAutoSync(list.some((a) => a.auto_sync));
        }
      } catch (e: any) {
        if (!silent) {
          setAssets([]);
          setLoadError(e?.message ?? '资产列表加载失败');
        }
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [projectId, tab],
  );

  useEffect(() => {
    void load();
  }, [load]);

  // SSE 出图事件 → 防抖静默刷新，让新图自动出现
  const latestAssetTs = useMemo(() => {
    const last = [...events].reverse().find((e) => e.type === 'asset');
    return last?.ts ?? 0;
  }, [events]);

  useEffect(() => {
    if (!latestAssetTs) return;
    const t = setTimeout(() => void load(true), 400);
    return () => clearTimeout(t);
  }, [latestAssetTs, load]);

  const onChanged = (a: AssetView) =>
    setAssets((prev) => prev.map((x) => (x.id === a.id ? a : x)));

  const onDeleted = (id: number) => setAssets((prev) => prev.filter((x) => x.id !== id));

  const create = async () => {
    if (!newName.trim()) {
      message.warning('请填写名称');
      return;
    }
    setCreating(true);
    try {
      const a = await createAsset(projectId, {
        type: tab,
        name: newName.trim(),
        desc: newDesc.trim() || undefined,
      });
      setAssets((prev) => [...prev, a]);
      setAddOpen(false);
      setNewName('');
      setNewDesc('');
      message.success(`已添加「${a.name}」`);
    } catch (e: any) {
      message.error(e?.message ?? '添加失败');
    } finally {
      setCreating(false);
    }
  };

  const toggleProjectSync = async (key: 'sync_enabled' | 'auto_sync', v: boolean) => {
    if (key === 'sync_enabled') setSyncAll(v);
    else setAutoSync(v);
    try {
      await setProjectAssetsSync(projectId, { [key]: v });
      message.success(v ? '已开启' : '已关闭');
      void load(true);
    } catch (e: any) {
      // 回滚 UI，避免开关状态与后端不一致
      if (key === 'sync_enabled') setSyncAll(!v);
      else setAutoSync(!v);
      message.error(e?.message ?? '设置失败');
    }
  };

  const tabMeta = TABS.find((t) => t.key === tab)!;

  return (
    <div data-testid="assets-page" style={{ padding: '18px 20px 80px' }}>
      {/* 顶部：胶囊 Tab + 右侧开关 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          marginBottom: 14,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', gap: 4 }}>
          {TABS.map((t) => (
            <div
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              data-testid={`assets-tab-${t.key}`}
              style={pillTabStyle(tab === t.key)}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <SyncOutlined style={{ color: palette.textSub, fontSize: 12 }} />
            <Text style={{ fontSize: 12, color: palette.textSub }}>同步资产</Text>
            <Switch
              size="small"
              checked={syncAll}
              data-testid="switch-sync-all"
              onChange={(v) => toggleProjectSync('sync_enabled', v)}
            />
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
            <Text style={{ fontSize: 12, color: palette.textSub }}>自动同步</Text>
            <Switch
              size="small"
              checked={autoSync}
              data-testid="switch-auto-sync"
              onChange={(v) => toggleProjectSync('auto_sync', v)}
            />
          </span>
        </div>
      </div>

      {/* 新增条 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '14px 16px',
          borderRadius: 14,
          background: palette.primaryGlow,
          border: `1px solid ${palette.border}`,
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: palette.text, marginBottom: 3 }}>
            {tab === 'character' ? '新增角色' : tab === 'scene' ? '新增场景' : '新增道具'}
          </div>
          <Text style={{ fontSize: 12, color: palette.textSub }}>
            创建空白{tabMeta.label.replace('列表', '')}或从素材库添加
          </Text>
        </div>
        <Button
          data-testid="assets-add"
          onClick={() => setAddOpen(true)}
          icon={<PlusOutlined />}
          style={{
            borderRadius: 999,
            background: '#f2f4f5',
            borderColor: '#f2f4f5',
            color: '#141617',
            fontWeight: 600,
            height: 32,
            padding: '0 16px',
          }}
        >
          添加
        </Button>
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

      {/* 卡片网格 */}
      {loading ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 14,
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <Skeleton.Node key={i} active style={{ width: '100%', height: 172, borderRadius: 16 }} />
          ))}
        </div>
      ) : assets.length === 0 ? (
        <div style={{ padding: '60px 0' }}>
          <Empty
            description={
              <Text style={{ color: palette.textDim, fontSize: 12 }}>
                暂无{tabMeta.label.replace('列表', '')}，上方「添加」新建一个
              </Text>
            }
          />
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 14,
          }}
        >
          {assets.map((a) => (
            <AssetRow
              key={a.id}
              asset={a}
              projectId={projectId}
              onOpen={() => navigate(`/projects/${projectId}/assets/${a.id}`)}
              onChanged={onChanged}
              onDeleted={onDeleted}
            />
          ))}
        </div>
      )}

      <BottomTip onNext={() => navigate(`/projects/${projectId}/episodes`)} />

      <Modal
        open={addOpen}
        title={`新增${tabMeta.label.replace('列表', '')}`}
        onCancel={() => setAddOpen(false)}
        onOk={create}
        okText="创建"
        cancelText="取消"
        confirmLoading={creating}
        destroyOnHidden
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 8 }}>
          <Input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={tabMeta.placeholder}
            onPressEnter={create}
          />
          <Input.TextArea
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="描述（可选），越具体出图越准"
            rows={3}
          />
        </div>
      </Modal>
    </div>
  );
}
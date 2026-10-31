import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  App as AntdApp,
  Button,
  Dropdown,
  Input,
  Spin,
  Switch,
  Tooltip,
  Typography,
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckOutlined,
  DeleteOutlined,
  DownOutlined,
  PlusOutlined,
  SoundOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
  addVariantGallery,
  createAssetVariant,
  deleteAssetVariant,
  getAsset,
  generateVariantImage,
  updateAssetVariant,
} from '@/infrastructure/api/dramaApi';
import type { AssetView, StyleItem } from '@/shared/types';
import { palette, pillTabStyle } from '../theme';
import { StylePicker } from '../components/StylePicker';

const { Text } = Typography;

/** 场景/道具可选的出图比例（对齐设计稿左下角的比例胶囊）。 */
const SCENE_RATIOS = ['16:9', '1:1', '3:4'] as const;

/** 左栏字段标签。 */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 12, color: palette.textSub, marginBottom: 6, marginTop: 14 }}>
      {children}
    </div>
  );
}

/** 图组缩略图行（角色/场景/道具共用）。点击可切换预览。 */
function GalleryRow({
  images,
  active,
  onPick,
  onAdd,
  busy,
}: {
  images: string[];
  active: string | null;
  onPick: (url: string) => void;
  onAdd: () => void;
  busy: boolean;
}) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', flex: 'none' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {images.map((u, i) => (
          <div
            key={`${u}-${i}`}
            role="button"
            tabIndex={0}
            data-testid={`gallery-thumb-${i}`}
            onClick={() => onPick(u)}
            onKeyDown={(e) => e.key === 'Enter' && onPick(u)}
            style={{
              width: 76,
              height: 52,
              borderRadius: 10,
              overflow: 'hidden',
              background: palette.surface2,
              border: `1.5px solid ${active === u ? palette.primary : palette.border}`,
              cursor: 'pointer',
              flex: 'none',
            }}
          >
            <img
              src={u}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        ))}
        <Tooltip title="把当前大图加入形象图组">
          <div
            role="button"
            tabIndex={0}
            data-testid="gallery-add"
            onClick={busy ? undefined : onAdd}
            onKeyDown={(e) => e.key === 'Enter' && !busy && onAdd()}
            style={{
              width: 76,
              height: 52,
              borderRadius: 10,
              border: `1px dashed ${palette.borderLight}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: palette.textDim,
              cursor: busy ? 'wait' : 'pointer',
              flex: 'none',
            }}
          >
            <PlusOutlined style={{ fontSize: 12 }} />
          </div>
        </Tooltip>
      </div>
      <Text style={{ fontSize: 11, color: palette.textDim, marginLeft: 'auto' }}>
        已添加形象 {images.length}/4
      </Text>
    </div>
  );
}

/** 底部工具条（模型 / 风格 / 比例）——三种资产类型共用。 */
function Toolbar({
  ratio,
  onRatio,
  showRatio,
  styleLabel,
  onOpenStyle,
  saving,
  onSave,
  onDelete,
}: {
  ratio: string;
  onRatio: (r: string) => void;
  showRatio: boolean;
  styleLabel: string | null;
  onOpenStyle: () => void;
  saving: boolean;
  onSave: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      style={{
        flex: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 18px',
        borderTop: `1px solid ${palette.border}`,
        background: '#0c0e0f',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          height: 30,
          padding: '0 12px',
          borderRadius: 999,
          background: palette.surface2,
          border: `1px solid ${palette.border}`,
          fontSize: 12,
          color: palette.text,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: palette.primary,
            display: 'inline-block',
          }}
        />
        Agnes Image 2.5 Flash
        <DownOutlined style={{ fontSize: 9, color: palette.textDim }} />
      </div>

      <div
        role="button"
        tabIndex={0}
        data-testid="open-style-picker"
        onClick={onOpenStyle}
        onKeyDown={(e) => e.key === 'Enter' && onOpenStyle()}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          height: 30,
          padding: '0 12px',
          borderRadius: 999,
          background: palette.surface2,
          border: `1px solid ${palette.border}`,
          fontSize: 12,
          color: palette.text,
          cursor: 'pointer',
          maxWidth: 260,
        }}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {styleLabel ?? '选择风格'}
        </span>
        <DownOutlined style={{ fontSize: 9, color: palette.textDim }} />
      </div>

      {showRatio && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 2,
            height: 30,
            padding: '0 4px',
            borderRadius: 999,
            background: palette.surface2,
            border: `1px solid ${palette.border}`,
          }}
        >
          {SCENE_RATIOS.map((r) => (
            <div
              key={r}
              role="button"
              tabIndex={0}
              data-testid={`ratio-${r}`}
              aria-selected={ratio === r}
              onClick={() => onRatio(r)}
              onKeyDown={(e) => e.key === 'Enter' && onRatio(r)}
              style={{
                padding: '0 10px',
                height: 24,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 999,
                fontSize: 11,
                cursor: 'pointer',
                color: ratio === r ? '#04201e' : palette.textSub,
                background: ratio === r ? palette.primary : 'transparent',
                fontWeight: ratio === r ? 600 : 400,
              }}
            >
              {r}
            </div>
          ))}
        </div>
      )}

      <div style={{ flex: 1 }} />
      {onDelete && (
        <Button
          size="small"
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={onDelete}
          style={{ fontSize: 12 }}
        >
          删除形象
        </Button>
      )}
      <Button
        size="small"
        type="text"
        icon={<CheckOutlined />}
        onClick={onSave}
        loading={saving}
        style={{ fontSize: 12, color: palette.textSub }}
      >
        保存
      </Button>
    </div>
  );
}

/**
 * 资产详情页。
 *
 * - 角色：三栏（左表单 / 中立绘 / 右四视图），形象有「立绘 + 四视图」两张图。
 * - 场景 / 道具：两栏（左表单 / 右单张大图 + 缩略图行）。这类资产只有一张
 *   横版成品图，套用角色的「立绘 + 四视图」会变成细长条 + 大片留白，与设计稿不符。
 */
export function AssetDetailPage({ projectId, assetId }: { projectId: number; assetId: number }) {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const [asset, setAsset] = useState<AssetView | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [variantName, setVariantName] = useState('');
  const [desc, setDesc] = useState('');
  const [applyAll, setApplyAll] = useState(false);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<'portrait' | 'sheet' | 'add' | null>(null);
  const [styleOpen, setStyleOpen] = useState(false);
  const [styleLabel, setStyleLabel] = useState<string | null>(null);
  // 场景/道具页的缩略图点击预览：null 表示展示当前形象的主图
  const [preview, setPreview] = useState<string | null>(null);
  const [ratio, setRatio] = useState<string>('16:9');
  // 主图真实宽高比：容器按它撑开，横图不再被塞进竖框留白
  const [imgRatio, setImgRatio] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const a = await getAsset(projectId, assetId);
      setAsset(a);
      setLoadError(null);
    } catch (e: any) {
      setLoadError(e?.message ?? '资产详情加载失败');
    } finally {
      setLoading(false);
    }
  }, [projectId, assetId]);

  useEffect(() => {
    void load();
  }, [load]);

  const variants = asset?.variants ?? [];
  const active = useMemo(
    () => variants.find((v) => v.id === activeId) ?? variants[0] ?? null,
    [variants, activeId],
  );
  const isCharacter = asset?.type === 'character';

  // 切换形象时把表单同步为该形象的值
  useEffect(() => {
    if (!asset || !active) return;
    setActiveId(active.id);
    setName(asset.name);
    setVariantName(active.name);
    setDesc(active.desc || asset.desc || '');
    setApplyAll(active.apply_to_all);
    // 换形象后预览回到该形象自己的主图
    setPreview(null);
    // 仅依赖 active.id，避免每次 asset 刷新都把用户正在编辑的内容重置
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id, asset?.id]);

  const apply = (a: AssetView) => setAsset(a);

  const save = async () => {
    if (!active) return;
    setSaving(true);
    try {
      const a = await updateAssetVariant(projectId, assetId, active.id, {
        name: variantName.trim() || active.name,
        desc,
        apply_to_all: applyAll,
      });
      apply(a);
      message.success('已保存');
    } catch (e: any) {
      message.error(e?.message ?? '保存失败');
    } finally {
      setSaving(false);
    }
  };

  const gen = async (kind: 'portrait' | 'sheet') => {
    if (!active) return;
    setBusy(kind);
    try {
      apply(
        await generateVariantImage(
          projectId,
          assetId,
          active.id,
          kind,
          // 场景/道具走比例控件；角色固定 3:4，不传
          isCharacter ? undefined : ratio,
        ),
      );
      setPreview(null);
      message.success(kind === 'portrait' ? '图片已生成' : '四视图已生成');
    } catch (e: any) {
      message.error(e?.message ?? '生成失败');
    } finally {
      setBusy(null);
    }
  };

  /** 「+」：把当前预览/主图收进图组（相当于把这张图加入素材）。 */
  const collect = async (url: string | null) => {
    if (!active || !url) {
      message.warning('请先生成图片');
      return;
    }
    setBusy('add');
    try {
      apply(await addVariantGallery(projectId, assetId, active.id, url));
      message.success('已添加到形象图组');
    } catch (e: any) {
      message.error(e?.message ?? '添加失败');
    } finally {
      setBusy(null);
    }
  };

  const addVariant = async () => {
    try {
      const a = await createAssetVariant(projectId, assetId, {
        name: '',
        desc: '',
        style_key: active?.style_key ?? undefined,
      });
      apply(a);
      const last = a.variants[a.variants.length - 1];
      if (last) setActiveId(last.id);
      message.success('已创建新形象，填好描述后点「生成」');
    } catch (e: any) {
      message.error(e?.message ?? '创建形象失败');
    }
  };

  const removeVariant = async () => {
    if (!active || active.kind === 'base') return;
    try {
      const a = await deleteAssetVariant(projectId, assetId, active.id);
      apply(a);
      setActiveId(a.variants[0]?.id ?? null);
      message.success('已删除形象');
    } catch (e: any) {
      message.error(e?.message ?? '删除失败');
    }
  };

  const pickStyle = async (s: StyleItem | null, customPrompt?: string) => {
    if (!active) return;
    try {
      if (s) {
        setStyleLabel(s.name);
        apply(await updateAssetVariant(projectId, assetId, active.id, { style_key: s.key }));
      } else {
        setStyleLabel(customPrompt ? `自定义：${customPrompt}` : '自定义风格');
        // 自定义风格写进描述尾部，直接参与 prompt 拼装
        const nextDesc = [
          active.desc || '',
          customPrompt ? `风格要求：${customPrompt}` : '',
        ]
          .filter(Boolean)
          .join('；');
        setDesc(nextDesc);
        apply(
          await updateAssetVariant(projectId, assetId, active.id, {
            desc: nextDesc,
            style_key: null,
          }),
        );
      }
      message.success('风格已应用，重新生成即可生效');
    } catch (e: any) {
      message.error(e?.message ?? '风格设置失败');
    }
  };

  if (loading && !asset) {
    return (
      <div style={{ padding: 80, textAlign: 'center' }}>
        <Spin />
      </div>
    );
  }

  if (loadError) {
    return (
      <div style={{ padding: 40 }}>
        <div
          style={{
            padding: '14px 16px',
            borderRadius: 12,
            background: '#2a1618',
            border: '1px solid #4a2528',
            display: 'flex',
            gap: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#ffb3b3', fontSize: 12, flex: 1 }}>{loadError}</Text>
          <Button size="small" onClick={() => void load()}>
            重试
          </Button>
          <Button size="small" type="text" onClick={() => navigate(`/projects/${projectId}/assets`)}>
            返回列表
          </Button>
        </div>
      </div>
    );
  }

  if (!asset || !active) return null;

  const portraitBusy = busy === 'portrait' || active.status === 'generating';
  const sheetBusy = busy === 'sheet';
  // 图组口径与列表卡保持一致：gallery 空则用立绘/四视图兜底，
  // 否则「已添加形象 0/4」会和旁边已经显示出来的大图自相矛盾。
  const gallery = (() => {
    if (active.gallery.length) return active.gallery;
    return [active.portrait_url, active.sheet_url].filter((u): u is string => Boolean(u));
  })();
  const heroUrl = preview ?? active.portrait_url;
  const typeLabel = asset.type === 'character' ? '角色' : asset.type === 'scene' ? '场景' : '道具';

  const header = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '10px 18px',
        borderBottom: `1px solid ${palette.border}`,
        flex: 'none',
      }}
    >
      <Button
        type="text"
        size="small"
        data-testid="detail-back"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(`/projects/${projectId}/assets`)}
        style={{ color: palette.textSub }}
      />
      <span style={{ fontSize: 13, color: palette.textSub }}>{typeLabel}信息</span>
      <div style={{ flex: 1 }} />
      <Dropdown
        trigger={['click']}
        menu={{
          items: [
            { key: 'new', label: '创建新形象' },
            { key: 'from', label: '从素材库添加' },
            ...(active.kind === 'base'
              ? []
              : [{ type: 'divider' as const }, { key: 'del', label: '删除当前形象', danger: true }]),
          ],
          onClick: ({ key }) => {
            if (key === 'new') void addVariant();
            if (key === 'from') message.info('素材库添加暂未开放，请用「+」把已生成的图收入图组');
            if (key === 'del') void removeVariant();
          },
        }}
      >
        <Button
          size="small"
          data-testid="detail-add"
          icon={<PlusOutlined />}
          style={{
            borderRadius: 999,
            background: '#1d2124',
            borderColor: palette.borderLight,
            color: palette.text,
            height: 30,
          }}
        >
          添加
        </Button>
      </Dropdown>
    </div>
  );

  const variantTabs = (withAdd: boolean) => (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 6 }}>
      {variants.map((v) => (
        <div
          key={v.id}
          role="tab"
          aria-selected={active.id === v.id}
          data-testid={`variant-tab-${v.id}`}
          style={pillTabStyle(active.id === v.id)}
          onClick={() => setActiveId(v.id)}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background:
                v.status === 'done'
                  ? palette.primary
                  : v.status === 'failed'
                    ? palette.danger
                    : v.status === 'generating'
                      ? palette.warn
                      : '#4a5055',
              display: 'inline-block',
            }}
          />
          {v.name}
        </div>
      ))}
      {withAdd && (
        <Tooltip title="新建形象">
          <div
            role="button"
            tabIndex={0}
            data-testid="variant-add"
            onClick={() => void addVariant()}
            onKeyDown={(e) => e.key === 'Enter' && void addVariant()}
            style={pillTabStyle(false)}
          >
            <PlusOutlined style={{ fontSize: 11 }} />
          </div>
        </Tooltip>
      )}
    </div>
  );

  const formPanel = (
    <div
      style={{
        width: 288,
        flex: 'none',
        borderRight: `1px solid ${palette.border}`,
        padding: '14px 16px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {variantTabs(false)}

      <FieldLabel>名称</FieldLabel>
      <Input value={name} onChange={(e) => setName(e.target.value)} disabled />

      <FieldLabel>形象名称</FieldLabel>
      <Input
        value={variantName}
        data-testid="variant-name-input"
        onChange={(e) => setVariantName(e.target.value)}
        placeholder="请输入"
      />

      {isCharacter && (
        <>
          <FieldLabel>声音</FieldLabel>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              height: 34,
              padding: '0 12px',
              borderRadius: 10,
              background: palette.surface2,
              border: `1px solid ${palette.border}`,
              fontSize: 12,
            }}
          >
            <SoundOutlined style={{ color: palette.primary, fontSize: 12 }} />
            <span style={{ color: palette.primary, flex: 1 }}>AI 自动适配</span>
            <DownOutlined style={{ color: palette.textDim, fontSize: 10 }} />
          </div>

          <FieldLabel>音色描述</FieldLabel>
          <Input.TextArea
            defaultValue="低沉浑厚且沉稳，磁性中年男声。"
            rows={2}
            maxLength={100}
            showCount
            style={{ fontSize: 12 }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
            <Switch
              size="small"
              checked={applyAll}
              data-testid="variant-apply-all"
              onChange={setApplyAll}
            />
            <Text style={{ fontSize: 12, color: palette.textSub }}>应用到所有形象</Text>
          </div>
        </>
      )}

      <FieldLabel>新集</FieldLabel>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          height: 34,
          padding: '0 12px',
          borderRadius: 10,
          background: palette.surface2,
          border: `1px solid ${palette.border}`,
          fontSize: 12,
          color: palette.textDim,
        }}
      >
        选择新集
        <span style={{ flex: 1 }} />
        <DownOutlined style={{ fontSize: 10 }} />
      </div>

      <FieldLabel>描述</FieldLabel>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <div
          role="button"
          tabIndex={0}
          data-testid="desc-thumb"
          onClick={() => void collect(heroUrl)}
          onKeyDown={(e) => e.key === 'Enter' && void collect(heroUrl)}
          style={{
            width: 40,
            height: 44,
            borderRadius: 8,
            overflow: 'hidden',
            flex: 'none',
            background: '#f4f5f5',
            border: `1px solid ${palette.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8a9095',
            cursor: 'pointer',
          }}
        >
          {heroUrl ? (
            <img
              src={heroUrl}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <PlusOutlined style={{ fontSize: 11 }} />
          )}
        </div>
        <Input.TextArea
          value={desc}
          data-testid="variant-desc-input"
          onChange={(e) => setDesc(e.target.value)}
          rows={isCharacter ? 8 : 10}
          maxLength={isCharacter ? 1200 : 1200}
          showCount
          placeholder={`输入${typeLabel}描述`}
          style={{ fontSize: 12 }}
        />
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        <Button
          block
          type="primary"
          data-testid="detail-save"
          loading={saving}
          onClick={save}
        >
          保存
        </Button>
      </div>
    </div>
  );

  const toolbar = (
    <Toolbar
      ratio={ratio}
      onRatio={setRatio}
      showRatio={!isCharacter}
      styleLabel={styleLabel}
      onOpenStyle={() => setStyleOpen(true)}
      saving={saving}
      onSave={save}
      onDelete={active.kind === 'base' ? undefined : () => void removeVariant()}
    />
  );

  /** 场景 / 道具：右侧一张按真实比例撑开的大图 + 缩略图行。 */
  const simpleStage = (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        overflowY: 'auto',
      }}
    >
      <Text style={{ fontSize: 12, color: palette.textSub }}>
        {asset.name} · {active.name}
      </Text>
      <div
        data-testid="asset-hero"
        style={{
          position: 'relative',
          borderRadius: 14,
          overflow: 'hidden',
          background: '#f4f5f5',
          border: `1px solid ${palette.border}`,
          // 有真实宽高比就按它撑开（横图不再被压成细条）；
          // 还没出图时给一个 16:9 的稳定占位，避免布局跳动。
          // 竖图（3:4）靠 maxHeight 收住，不会顶出可视区。
          aspectRatio: `${imgRatio ?? 16 / 9}`,
          width: '100%',
          maxWidth: `calc((100vh - 300px) * ${imgRatio ?? 16 / 9})`,
          maxHeight: 'calc(100vh - 300px)',
          margin: '0 auto',
          alignSelf: 'center',
        }}
      >
        {heroUrl ? (
          <img
            src={heroUrl}
            alt={active.name}
            onLoad={(e) => {
              const el = e.currentTarget;
              if (el.naturalWidth && el.naturalHeight) {
                setImgRatio(el.naturalWidth / el.naturalHeight);
              }
            }}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        ) : portraitBusy ? (
          <div className="shimmer" style={{ width: '100%', height: '100%' }} />
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#8a9095',
              fontSize: 12,
            }}
          >
            {active.status === 'failed' ? '生成失败，点下方重试' : `还没有${typeLabel}图`}
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            bottom: 10,
            right: 10,
            display: 'flex',
            gap: 6,
          }}
        >
          <Button
            size="small"
            data-testid="gen-portrait"
            loading={portraitBusy}
            disabled={portraitBusy}
            onClick={() => void gen('portrait')}
            icon={<ReloadOutlined style={{ fontSize: 11 }} />}
            style={{
              borderRadius: 999,
              height: 28,
              fontSize: 12,
              background: 'rgba(20,22,23,.9)',
              borderColor: 'rgba(255,255,255,.2)',
              color: palette.text,
            }}
          >
            {heroUrl ? '重新生成' : '生成'}
          </Button>
          <Button
            size="small"
            data-testid="collect-portrait"
            loading={busy === 'add'}
            onClick={() => void collect(heroUrl)}
            icon={<PlusOutlined style={{ fontSize: 11 }} />}
            style={{
              borderRadius: 999,
              height: 28,
              background: palette.primary,
              borderColor: palette.primary,
              color: '#04201e',
            }}
          />
        </div>
      </div>

      {active.error && (
        <Text style={{ fontSize: 11, color: palette.danger }} ellipsis={{ tooltip: active.error }}>
          {active.error}
        </Text>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 2 }}>
        <GalleryRow
          images={gallery}
          active={heroUrl}
          onPick={(u) => setPreview(u)}
          onAdd={() => void collect(heroUrl)}
          busy={busy === 'add'}
        />
      </div>
    </div>
  );

  /** 角色：三栏（中立绘 / 右四视图）。 */
  const characterStage = (
    <div style={{ flex: 1, display: 'flex', minWidth: 0 }}>
      <div
        style={{
          width: 300,
          flex: 'none',
          borderRight: `1px solid ${palette.border}`,
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <Text style={{ fontSize: 12, color: palette.textSub }}>
          {asset.name} · {active.name}
        </Text>
        <div
          data-testid="asset-hero"
          style={{
            position: 'relative',
            flex: 1,
            minHeight: 0,
            borderRadius: 14,
            overflow: 'hidden',
            // 立绘是白底稿，容器也用浅色，避免上下露黑边显得断裂
            background: '#f4f5f5',
            border: `1px solid ${palette.border}`,
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              zIndex: 2,
              fontSize: 10,
              padding: '2px 8px',
              borderRadius: 6,
              background: 'rgba(0,0,0,.5)',
              color: '#dfe4e6',
              border: '1px solid rgba(255,255,255,.18)',
            }}
          >
            AI生成
          </span>
          {active.portrait_url ? (
            <img
              src={active.portrait_url}
              alt={active.name}
              // contain：立绘是 3:4 人物稿，用 cover 会把头/脚裁掉
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : portraitBusy ? (
            <div className="shimmer" style={{ width: '100%', height: '100%' }} />
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: palette.textDim,
                fontSize: 12,
              }}
            >
              {active.status === 'failed' ? '生成失败，点下方重试' : '还没有立绘'}
            </div>
          )}
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              display: 'flex',
              gap: 6,
              zIndex: 2,
            }}
          >
            <Button
              size="small"
              data-testid="gen-portrait"
              loading={portraitBusy}
              disabled={portraitBusy}
              onClick={() => void gen('portrait')}
              icon={<ReloadOutlined style={{ fontSize: 11 }} />}
              style={{
                borderRadius: 999,
                height: 28,
                fontSize: 12,
                background: 'rgba(20,22,23,.9)',
                borderColor: 'rgba(255,255,255,.2)',
                color: palette.text,
              }}
            >
              {active.portrait_url ? '重新生成' : '生成'}
            </Button>
            <Button
              size="small"
              data-testid="collect-portrait"
              loading={busy === 'add'}
              onClick={() => void collect(active.portrait_url)}
              icon={<PlusOutlined style={{ fontSize: 11 }} />}
              style={{
                borderRadius: 999,
                height: 28,
                background: palette.primary,
                borderColor: palette.primary,
                color: '#04201e',
              }}
            />
          </div>
        </div>
        {active.error && (
          <Text style={{ fontSize: 11, color: palette.danger }} ellipsis={{ tooltip: active.error }}>
            {active.error}
          </Text>
        )}
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div
          style={{
            position: 'relative',
            flex: 1,
            minHeight: 0,
            borderRadius: 14,
            overflow: 'hidden',
            background: '#f4f5f5',
            border: `1px solid ${palette.border}`,
          }}
        >
          {active.sheet_url ? (
            <img
              src={active.sheet_url}
              alt="四视图"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : sheetBusy ? (
            <div className="shimmer" style={{ width: '100%', height: '100%' }} />
          ) : (
            <div
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                color: '#8a9095',
                fontSize: 12,
              }}
            >
              <span>四视图（正 / 侧 / 背 全身）</span>
              <span style={{ fontSize: 11, color: '#a8aeb2' }}>
                以当前立绘为参考生成，保持服装与长相一致
              </span>
            </div>
          )}
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              display: 'flex',
              gap: 6,
            }}
          >
            <Button
              size="small"
              data-testid="gen-sheet"
              loading={sheetBusy}
              disabled={sheetBusy}
              onClick={() => void gen('sheet')}
              icon={<ReloadOutlined style={{ fontSize: 11 }} />}
              style={{
                borderRadius: 999,
                height: 28,
                fontSize: 12,
                background: 'rgba(20,22,23,.9)',
                borderColor: 'rgba(255,255,255,.2)',
                color: palette.text,
              }}
            >
              {active.sheet_url ? '重新生成' : '生成'}
            </Button>
            <Button
              size="small"
              data-testid="collect-sheet"
              onClick={() => void collect(active.sheet_url)}
              icon={<PlusOutlined style={{ fontSize: 11 }} />}
              style={{
                borderRadius: 999,
                height: 28,
                background: palette.primary,
                borderColor: palette.primary,
                color: '#04201e',
              }}
            />
          </div>
        </div>

        <GalleryRow
          images={gallery}
          active={active.sheet_url}
          onPick={(u) => setPreview(u)}
          onAdd={() => void collect(active.sheet_url)}
          busy={busy === 'add'}
        />
      </div>
    </div>
  );

  return (
    <div
      data-testid="asset-detail-page"
      data-asset-type={asset.type}
      style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 56px)' }}
    >
      {header}
      <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {formPanel}
        {isCharacter ? characterStage : simpleStage}
      </div>
      {toolbar}
      <StylePicker
        open={styleOpen}
        value={active.style_key}
        onClose={() => setStyleOpen(false)}
        onPick={(s, custom) => void pickStyle(s, custom)}
      />
    </div>
  );
}
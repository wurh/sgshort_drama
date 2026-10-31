import { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Select } from 'antd';
import {
  CheckOutlined,
  DownOutlined,
  InfoCircleOutlined,
  RightOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import type { AssetView, KeyframeView, StyleItem } from '@/shared/types';
import { palette } from '../theme';
import { StylePicker } from './StylePicker';

/** 出图分辨率档位（对齐设计稿「输出设置」下拉）。 */
export const IMAGE_SIZE_OPTIONS = ['1K', '2K', '4K'] as const;
/** 视频分辨率档位。 */
export const VIDEO_SIZE_OPTIONS = ['720p', '1080p'] as const;

export interface GenerateSettings {
  /** 1K / 2K / 4K */
  size: string;
  /** 风格 key */
  styleKey: string | null;
  /** 风格展示名 */
  styleLabel: string | null;
  /** 风格提示词（透传给后端拼进 prompt） */
  stylePrompt: string | null;
  /** 勾选的参考图 URL（空 = 按片段引用自动挑选） */
  refImages: string[];
}

export const DEFAULT_IMAGE_SETTINGS: GenerateSettings = {
  size: '1K',
  styleKey: null,
  styleLabel: null,
  stylePrompt: null,
  refImages: [],
};

export const DEFAULT_VIDEO_SETTINGS: GenerateSettings = {
  size: '720p',
  styleKey: null,
  styleLabel: null,
  stylePrompt: null,
  refImages: [],
};

/** 一行「模型 / 风格」选择项（描边卡片，右侧箭头）。 */
function SettingRow({
  label,
  value,
  icon,
  thumb,
  onClick,
  testId,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  thumb?: React.ReactNode;
  onClick?: () => void;
  testId?: string;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      data-testid={testId}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '9px 12px',
        borderRadius: 12,
        border: `1px solid ${palette.border}`,
        background: palette.surface2,
        cursor: 'pointer',
        marginBottom: 8,
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          flex: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: palette.textSub,
          fontSize: 13,
        }}
      >
        {thumb ?? icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: palette.textDim, lineHeight: 1.2 }}>{label}</div>
        <div
          style={{
            fontSize: 12,
            color: palette.text,
            lineHeight: 1.5,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {value}
        </div>
      </div>
      <RightOutlined style={{ fontSize: 10, color: palette.textDim, flex: 'none' }} />
    </div>
  );
}

/** 参考图缩略图（下方带名称，选中打勾）。 */
function RefThumb({
  url,
  name,
  active,
  onToggle,
  testId,
}: {
  url: string;
  name: string;
  active: boolean;
  onToggle: () => void;
  testId?: string;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      data-testid={testId}
      onClick={onToggle}
      onKeyDown={(e) => e.key === 'Enter' && onToggle()}
      style={{ width: '100%', cursor: 'pointer' }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1 / 1',
          borderRadius: 10,
          overflow: 'hidden',
          background: '#f4f5f5',
          border: `1.5px solid ${active ? palette.primary : palette.border}`,
        }}
      >
        <img
          src={url}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.opacity = '0.15';
          }}
        />
        {active && (
          <span
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              width: 16,
              height: 16,
              borderRadius: 999,
              background: palette.primary,
              color: '#04201e',
              fontSize: 9,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CheckOutlined />
          </span>
        )}
      </div>
      <div
        style={{
          marginTop: 4,
          fontSize: 10,
          color: active ? palette.text : palette.textDim,
          lineHeight: 1.3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {name}
      </div>
    </div>
  );
}

/**
 * 右侧生成面板（抽屉）。
 * - kind='image'：模型 + 风格 + 输出设置(1K/2K/4K) + 「生成图片」。
 * - kind='video'：模型 + 风格 + 镜头参考图 + 参考图多选 + 输出设置(720p/1080p) + 「生成视频」。
 *
 * 两份设计稿除了参考图区域外结构一致，故合并成一个组件，避免两套样式漂移。
 */
export function GeneratePanel({
  open,
  kind,
  segment,
  assets,
  settings,
  busy,
  cost,
  onClose,
  onChange,
  onSubmit,
}: {
  open: boolean;
  kind: 'image' | 'video';
  segment: KeyframeView | null;
  assets: AssetView[];
  settings: GenerateSettings;
  busy?: boolean;
  /** 按钮上的积分数字。 */
  cost?: number;
  onClose: () => void;
  onChange: (patch: Partial<GenerateSettings>) => void;
  onSubmit: () => void;
}) {
  const isVideo = kind === 'video';
  const sizes = isVideo ? VIDEO_SIZE_OPTIONS : IMAGE_SIZE_OPTIONS;
  /** 风格库弹窗开关（复用资产页同一套风格库，避免两处风格清单漂移）。 */
  const [styleOpen, setStyleOpen] = useState(false);

  /** 参考图候选：角色 > 场景 > 道具，每个资产取基础形象主图。 */
  const candidates = useMemo(() => {
    const order: Record<string, number> = { character: 0, scene: 1, prop: 2 };
    return assets
      .filter((a) => Boolean(a.base_image_url))
      .slice()
      .sort((x, y) => (order[x.type] ?? 9) - (order[y.type] ?? 9))
      .map((a) => {
        const base = a.variants?.[0];
        const variantName = base?.name && base.name !== '基础形象' ? `-${base.name}` : '-基础形象';
        return { url: a.base_image_url as string, name: `${a.name}${variantName}` };
      })
      .slice(0, 12);
  }, [assets]);

  /** 打开时默认把片段已引用的资产图片勾上，避免面板一片空白让人以为没参考。 */
  const [inited, setInited] = useState(false);
  useEffect(() => {
    if (!open) {
      setInited(false);
      return;
    }
    if (inited || !isVideo || !candidates.length) return;
    if (settings.refImages.length > 0) {
      setInited(true);
      return;
    }
    onChange({ refImages: candidates.slice(0, 4).map((c) => c.url) });
    setInited(true);
    // settings.refImages 变化不应重新初始化，否则用户取消勾选会被打回去
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, inited, isVideo, candidates]);

  const toggleRef = (url: string) => {
    const has = settings.refImages.includes(url);
    onChange({
      refImages: has
        ? settings.refImages.filter((u) => u !== url)
        : [...settings.refImages, url].slice(0, 5),
    });
  };

  /** 镜头参考图：优先片段关键帧，其次分镜画面。 */
  const shotRef = segment?.keyframe_url || segment?.shot_image_url || null;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={330}
      maskClosable
      closable={false}
      // 关闭即销毁：否则再次打开会残留上一次的勾选/滚动位置
      destroyOnClose
      data-testid="generate-panel"
      styles={{
        body: { padding: 16, display: 'flex', flexDirection: 'column', background: '#101213' },
        header: { display: 'none' },
        mask: { background: 'rgba(0,0,0,.55)' },
      }}
      title={null}
    >
      {/* 标题行 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: palette.text }}>
          {isVideo ? '生成视频' : '生成图片'}
        </span>
        <RightOutlined style={{ fontSize: 10, color: palette.textDim, marginLeft: 4 }} />
        <Button
          type="text"
          size="small"
          data-testid="generate-panel-close"
          onClick={onClose}
          style={{ marginLeft: 'auto', color: palette.textSub, fontSize: 14 }}
          icon={<span style={{ fontSize: 14, lineHeight: 1 }}>✕</span>}
        />
      </div>

      {/* 模型 */}
      <SettingRow
        testId="panel-model"
        label="模型"
        value={isVideo ? 'Agnes Video 2.5 Flash' : 'Agnes Image 2.5 Flash'}
        icon={<ThunderboltOutlined style={{ color: palette.primary }} />}
      />

      {/* 风格 */}
      <SettingRow
        testId="panel-style"
        label="风格"
        value={settings.styleLabel ?? '未选择风格'}
        thumb={
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              display: 'inline-block',
              background: settings.styleKey
                ? 'linear-gradient(150deg,#2a3a3d,#151a1b)'
                : 'linear-gradient(150deg,#3a2f24,#151a1b)',
              border: `1px solid ${palette.border}`,
            }}
          />
        }
        onClick={() => setStyleOpen(true)}
      />

      {/* 镜头参考图（仅视频） */}
      {isVideo && (
        <div style={{ marginTop: 6 }}>
          <div style={{ fontSize: 11, color: palette.textSub, marginBottom: 6 }}>镜头参考图</div>
          <div
            data-testid="panel-shot-ref"
            style={{
              height: 150,
              borderRadius: 12,
              border: `1px solid ${palette.border}`,
              background: '#0a0c0d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              marginBottom: 12,
            }}
          >
            {shotRef ? (
              <img
                src={shotRef}
                alt="镜头参考图"
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
              />
            ) : (
              <span style={{ fontSize: 11, color: palette.textDim }}>先生成关键帧作为参考</span>
            )}
          </div>
        </div>
      )}

      {/* 参考图（仅视频） */}
      {isVideo && (
        <div>
          <div
            style={{
              fontSize: 11,
              color: palette.textSub,
              marginBottom: 6,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            参考图
            <span style={{ marginLeft: 'auto', fontSize: 10, color: palette.textDim }}>
              已选 {settings.refImages.length}/5
            </span>
          </div>
          <div
            data-testid="panel-refs"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 8,
              maxHeight: 210,
              overflowY: 'auto',
              paddingRight: 2,
            }}
          >
            {candidates.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', fontSize: 11, color: palette.textDim }}>
                资产库还没有可用图片
              </div>
            ) : (
              candidates.map((c) => (
                <RefThumb
                  key={c.url}
                  testId={`panel-ref-${c.name}`}
                  url={c.url}
                  name={c.name}
                  active={settings.refImages.includes(c.url)}
                  onToggle={() => toggleRef(c.url)}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* 输出设置 + 生成按钮：贴底 */}
      <div style={{ marginTop: 'auto', paddingTop: 16 }}>
        <div style={{ fontSize: 11, color: palette.textSub, marginBottom: 6 }}>输出设置</div>
        <Select
          data-testid="panel-size"
          value={settings.size}
          onChange={(v) => onChange({ size: v })}
          options={sizes.map((s) => ({ value: s, label: s }))}
          style={{ width: 110 }}
          suffixIcon={<DownOutlined style={{ fontSize: 9, color: palette.textDim }} />}
        />
        <Button
          block
          data-testid="panel-submit"
          loading={busy}
          onClick={onSubmit}
          disabled={isVideo && !shotRef}
          style={{
            marginTop: 12,
            height: 38,
            borderRadius: 999,
            background: '#f2f4f5',
            borderColor: '#f2f4f5',
            color: '#141617',
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {isVideo ? '生成视频' : '生成图片'} ◆ {cost ?? 0}
        </Button>
        <div
          style={{
            marginTop: 8,
            textAlign: 'center',
            fontSize: 10,
            color: palette.textDim,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <InfoCircleOutlined style={{ fontSize: 10 }} />
          内容由AI生成，请勿用于非法用途
        </div>
      </div>

      {/* 风格库弹窗：选中后回填名字与提示词，真正参与 prompt 拼装 */}
      <StylePicker
        open={styleOpen}
        value={settings.styleKey}
        onClose={() => setStyleOpen(false)}
        onPick={(s: StyleItem | null, customPrompt?: string) => {
          if (s) {
            onChange({ styleKey: s.key, styleLabel: s.name, stylePrompt: s.prompt });
          } else {
            onChange({
              styleKey: 'custom',
              styleLabel: customPrompt ? `自定义：${customPrompt}` : '自定义风格',
              stylePrompt: customPrompt ?? null,
            });
          }
        }}
      />
    </Drawer>
  );
}
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  App as AntdApp,
  Button,
  Dropdown,
  Input,
  Popconfirm,
  Select,
  Skeleton,
  Tooltip,
  Typography,
} from 'antd';
import {
  CheckOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  PlusOutlined,
  ThunderboltOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import {
  addKeyframe,
  addShot,
  batchDownload,
  batchImages,
  batchVideos,
  deleteKeyframe,
  deleteShot,
  editSegment,
  editShot,
  genKeyframeImage,
  genKeyframeVideo,
  getEpisode,
  listAssets,
  listKeyframes,
} from '@/infrastructure/api/dramaApi';
import type {
  AssetView,
  EpisodeDetail,
  KeyframeView,
  SegmentShot,
} from '@/shared/types';
import { palette } from '../theme';
import { useEpisodeStore } from '@/application/stores/episodeStore';
import {
  DEFAULT_IMAGE_SETTINGS,
  DEFAULT_VIDEO_SETTINGS,
  GeneratePanel,
  type GenerateSettings,
} from '../components/GeneratePanel';

const { Text } = Typography;
const { TextArea } = Input;

/** 常用景别（设计稿「分镜N」后方的景别下拉）。 */
const SHOT_SIZES = ['大特写', '特写', '近景', '中景', '中近景', '全景', '远景', '空镜'];
/** 常用运镜。 */
const CAMERAS = ['固定', '推', '拉', '摇', '移', '跟', '升降', '手持'];
/** 片段时长约束（设计稿提示语：4-15s）。 */
const SEGMENT_SECONDS_MIN = 4;
const SEGMENT_SECONDS_MAX = 15;

const fieldLabel: React.CSSProperties = {
  fontSize: 11,
  color: palette.textDim,
  marginRight: 2,
  flex: 'none',
};

/** 顶部工具条按钮（描边胶囊）。 */
function ToolButton({
  icon,
  children,
  onClick,
  loading,
  testId,
  primary,
  disabled,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
  testId?: string;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Button
      size="small"
      data-testid={testId}
      icon={icon}
      loading={loading}
      disabled={disabled}
      onClick={onClick}
      style={{
        borderRadius: 999,
        height: 28,
        fontSize: 12,
        background: primary ? '#f2f4f5' : 'transparent',
        borderColor: primary ? '#f2f4f5' : palette.borderLight,
        color: primary ? '#141617' : palette.text,
        fontWeight: primary ? 600 : 400,
      }}
    >
      {children}
    </Button>
  );
}

/** 左列片段缩略图（竖排）。 */
function SegmentRail({
  segments,
  activeId,
  onSelect,
  onAdd,
}: {
  segments: KeyframeView[];
  activeId: number | null;
  onSelect: (id: number) => void;
  onAdd: () => void;
}) {
  return (
    <div
      data-testid="segment-rail"
      style={{
        width: 72,
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        paddingBottom: 8,
        alignSelf: 'stretch',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}
      >
        {segments.map((s) => {
          const active = s.id === activeId;
          const img = s.keyframe_url || s.shot_image_url;
          return (
            <div
              key={s.id}
              role="button"
              tabIndex={0}
              data-testid={`segment-thumb-${s.id}`}
              onClick={() => onSelect(s.id)}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(s.id)}
              style={{
                position: 'relative',
                width: 52,
                height: 52,
                flex: 'none',
                borderRadius: 12,
                overflow: 'hidden',
                cursor: 'pointer',
                background: palette.surface2,
                border: `1.5px solid ${active ? palette.primary : palette.border}`,
              }}
            >
              {img ? (
                <img
                  src={img}
                  alt={`片段 ${s.seq}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.opacity = '0';
                  }}
                />
              ) : (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: palette.textDim,
                    fontSize: 10,
                  }}
                >
                  <PictureOutlined />
                </div>
              )}
              <span
                style={{
                  position: 'absolute',
                  left: 3,
                  top: 3,
                  minWidth: 14,
                  height: 14,
                  padding: '0 3px',
                  borderRadius: 4,
                  background: 'rgba(8,10,10,.72)',
                  color: '#e9ecee',
                  fontSize: 9,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {s.seq}
              </span>
            </div>
          );
        })}
      </div>

      <Tooltip title="新增片段">
        <div
          role="button"
          tabIndex={0}
          data-testid="segment-add"
          onClick={onAdd}
          onKeyDown={(e) => e.key === 'Enter' && onAdd()}
          style={{
            width: 52,
            height: 52,
            flex: 'none',
            borderRadius: 12,
            border: `1px dashed ${palette.borderLight}`,
            color: palette.textDim,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <PlusOutlined />
        </div>
      </Tooltip>
    </div>
  );
}

/**
 * 中栏：一个片段卡片。
 * 结构严格对齐设计稿：
 *   [分镜 N 青色胶囊] Segment N … [编辑/删除]
 *   ⓘ 片段时长请限制在 4-15s，输入"@"可引用角色、场景
 *   根据以下分镜生成视频
 *   本镜头场景设定：  ⦿ Select
 *   分镜 1  ⏱ 5s   （分镜块，正文留白，点击展开编辑四要素）
 *   + 添加分镜
 */
function SegmentCard({
  seg,
  busy,
  onPatchSegment,
  onPatchShot,
  onAddShot,
  onRemoveShot,
  onRemoveSegment,
}: {
  seg: KeyframeView;
  busy: boolean;
  onPatchSegment: (patch: { scene_setting?: string }) => void;
  onPatchShot: (shotId: string, patch: Partial<SegmentShot>) => void;
  onAddShot: () => void;
  onRemoveShot: (shotId: string) => void;
  onRemoveSegment: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [scene, setScene] = useState(seg.scene_setting ?? '');
  const totalSeconds = seg.shots.reduce((s, x) => s + (x.seconds || 0), 0);
  const outOfRange = totalSeconds < SEGMENT_SECONDS_MIN || totalSeconds > SEGMENT_SECONDS_MAX;

  useEffect(() => {
    setScene(seg.scene_setting ?? '');
    setEditing(false);
  }, [seg.id, seg.scene_setting]);

  const saveScene = () => {
    setEditing(false);
    if (scene !== (seg.scene_setting ?? '')) onPatchSegment({ scene_setting: scene });
  };

  return (
    <div
      data-testid={`segment-card-${seg.id}`}
      style={{
        borderRadius: 14,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        padding: 14,
        // 卡片撑满中栏可用高度，避免设计稿里「卡片很长、底部还留空」的观感
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        minHeight: 420,
      }}
    >
      {/* 头部：分镜 N 胶囊 + Segment N + 时长 + 编辑/删除 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          data-testid={`segment-badge-${seg.id}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 20,
            padding: '0 9px',
            borderRadius: 6,
            background: palette.primary,
            color: '#04201e',
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          分镜 {seg.seq}
        </span>
        <Text style={{ fontSize: 12, color: palette.text, fontWeight: 600 }}>
          Segment {seg.seq}
        </Text>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            color: outOfRange ? palette.warn : palette.textDim,
            fontSize: 11,
            marginLeft: 2,
          }}
        >
          <ClockCircleOutlined style={{ fontSize: 11 }} />
          {totalSeconds}s
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 2 }}>
          <Tooltip title={editing ? '完成' : '编辑场景设定'}>
            <Button
              type="text"
              size="small"
              data-testid={`segment-edit-${seg.id}`}
              icon={
                editing ? (
                  <CheckOutlined style={{ color: palette.primary, fontSize: 12 }} />
                ) : (
                  <EditOutlined style={{ color: palette.textSub, fontSize: 12 }} />
                )
              }
              onClick={() => (editing ? saveScene() : setEditing(true))}
            />
          </Tooltip>
          <Popconfirm
            title="删除该片段？"
            description="片段内的分镜与图片一并删除"
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
            onConfirm={onRemoveSegment}
          >
            <Button
              type="text"
              size="small"
              data-testid={`segment-remove-${seg.id}`}
              icon={<DeleteOutlined style={{ color: palette.textSub, fontSize: 12 }} />}
            />
          </Popconfirm>
        </div>
      </div>

      {/* 时长提示 */}
      <div
        style={{
          marginTop: 6,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontSize: 10,
          color: palette.textDim,
        }}
      >
        <InfoCircleOutlined style={{ fontSize: 10 }} />
        片段时长请限制在 {SEGMENT_SECONDS_MIN}-{SEGMENT_SECONDS_MAX}s，输入"@"可引用角色、场景
      </div>

      {/* 分区标题 */}
      <div style={{ marginTop: 12, fontSize: 12, color: palette.text, fontWeight: 500 }}>
        根据以下分镜生成视频
      </div>

      {/* 场景设定 */}
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontSize: 12, color: palette.textSub, flex: 'none' }}>本镜头场景设定：</Text>
        {editing ? (
          <Input
            size="small"
            autoFocus
            value={scene}
            data-testid={`segment-scene-input-${seg.id}`}
            onChange={(e) => setScene(e.target.value)}
            onPressEnter={saveScene}
            onBlur={saveScene}
            placeholder="如：90年代老街 · 基础形象"
            style={{ maxWidth: 260, background: palette.surface2 }}
          />
        ) : (
          <span
            role="button"
            tabIndex={0}
            onClick={() => setEditing(true)}
            onKeyDown={(e) => e.key === 'Enter' && setEditing(true)}
            data-testid={`segment-scene-${seg.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              height: 24,
              padding: '0 10px',
              borderRadius: 999,
              background: 'transparent',
              // 设计稿是「描边胶囊 + 青色 @ 图标」，不是实心块
              border: `1px solid ${seg.scene_setting ? palette.primary : palette.borderLight}`,
              color: seg.scene_setting ? palette.text : palette.textSub,
              fontSize: 11,
              cursor: 'pointer',
              maxWidth: 300,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ color: palette.primary, fontSize: 10 }}>@</span>
            {seg.scene_setting || 'Select'}
          </span>
        )}
      </div>

      {/* 分镜列表 */}
      <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {seg.shots.map((shot, i) => (
          <ShotBlock
            key={shot.id}
            index={i + 1}
            shot={shot}
            canRemove={seg.shots.length > 1}
            onPatch={(patch) => onPatchShot(shot.id, patch)}
            onRemove={() => onRemoveShot(shot.id)}
          />
        ))}
      </div>

      {/* 添加分镜 */}
      <div
        role="button"
        tabIndex={0}
        data-testid={`segment-add-shot-${seg.id}`}
        onClick={() => !busy && onAddShot()}
        onKeyDown={(e) => e.key === 'Enter' && !busy && onAddShot()}
        style={{
          marginTop: 10,
          height: 34,
          borderRadius: 10,
          border: `1px dashed ${palette.borderLight}`,
          color: palette.textDim,
          fontSize: 12,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          cursor: busy ? 'wait' : 'pointer',
        }}
      >
        <PlusOutlined style={{ fontSize: 11 }} />
        添加分镜
      </div>
    </div>
  );
}

/**
 * 一个分镜块。
 * 设计稿形态：标题行「分镜 N  ⏱ Ns」+ 下方留白正文区。
 * 有内容时按「画面 / 运镜 / 声音 / 字幕」四行展示，点击某行即可就地编辑；
 * 空内容时只留一片可点击的空白区，不再顶出「(占位)：待补充画面描述」这类噪声文案。
 */
function ShotBlock({
  index,
  shot,
  canRemove,
  onPatch,
  onRemove,
}: {
  index: number;
  shot: SegmentShot;
  canRemove: boolean;
  onPatch: (patch: Partial<SegmentShot>) => void;
  onRemove: () => void;
}) {
  const hasContent = Boolean(
    shot.visual || shot.camera || shot.sound || shot.caption || shot.shot_size,
  );

  return (
    <div
      data-testid={`shot-item-${shot.id}`}
      style={{
        borderRadius: 10,
        background: palette.surface2,
        border: `1px solid ${palette.border}`,
        padding: '10px 12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Text style={{ fontSize: 12, color: palette.text, fontWeight: 600 }}>分镜 {index}</Text>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 3,
            height: 18,
            padding: '0 7px',
            borderRadius: 999,
            background: palette.surface3,
            border: `1px solid ${palette.borderLight}`,
            color: palette.textSub,
            fontSize: 10,
          }}
        >
          <ClockCircleOutlined style={{ fontSize: 9 }} />
          <Select
            variant="borderless"
            size="small"
            value={shot.seconds}
            data-testid={`shot-seconds-${shot.id}`}
            onChange={(v) => onPatch({ seconds: v })}
            options={[2, 3, 4, 5, 6, 8, 10, 12, 15].map((v) => ({ value: v, label: `${v}s` }))}
            style={{ width: 46, fontSize: 10 }}
            popupMatchSelectWidth={72}
            suffixIcon={null}
          />
        </span>
        <Select
          size="small"
          value={shot.shot_size || undefined}
          placeholder="景别"
          data-testid={`shot-size-${shot.id}`}
          onChange={(v) => onPatch({ shot_size: v })}
          options={SHOT_SIZES.map((v) => ({ value: v, label: v }))}
          style={{ width: 84 }}
          allowClear
          suffixIcon={<DownOutlined style={{ fontSize: 9, color: palette.textDim }} />}
        />
        <div style={{ marginLeft: 'auto' }}>
          <Popconfirm
            title="删除这个分镜？"
            okText="删除"
            cancelText="取消"
            okButtonProps={{ danger: true }}
            onConfirm={onRemove}
            disabled={!canRemove}
          >
            <Button
              type="text"
              size="small"
              disabled={!canRemove}
              data-testid={`shot-remove-${shot.id}`}
              icon={<CloseOutlined style={{ fontSize: 10, color: palette.textDim }} />}
            />
          </Popconfirm>
        </div>
      </div>

      {hasContent ? (
        <div style={{ marginTop: 2 }}>
          <ShotField
            label="画面"
            testId={`shot-visual-${shot.id}`}
            value={shot.visual}
            placeholder="描述这一镜的画面内容"
            onCommit={(v) => onPatch({ visual: v })}
          />
          <ShotField
            label="运镜"
            testId={`shot-camera-${shot.id}`}
            value={shot.camera}
            placeholder="推 / 拉 / 摇 / 移 / 固定"
            options={CAMERAS}
            onCommit={(v) => onPatch({ camera: v })}
          />
          <ShotField
            label="声音"
            testId={`shot-sound-${shot.id}`}
            value={shot.sound}
            placeholder="环境声 / 台词 / 音效"
            onCommit={(v) => onPatch({ sound: v })}
          />
          <ShotField
            label="字幕"
            testId={`shot-caption-${shot.id}`}
            value={shot.caption}
            placeholder="(可留空，不显示字幕)"
            onCommit={(v) => onPatch({ caption: v })}
          />
        </div>
      ) : (
        // 空分镜：保留设计稿里的留白区，点击即开始写画面描述
        <div style={{ marginTop: 8 }}>
          <ShotField
            label="画面"
            testId={`shot-visual-${shot.id}`}
            value=""
            placeholder="点击填写这一镜的画面内容"
            onCommit={(v) => onPatch({ visual: v })}
          />
        </div>
      )}
    </div>
  );
}

/** 分镜四要素的一行（label + 可编辑文本，失焦保存）。 */
function ShotField({
  label,
  value,
  placeholder,
  testId,
  options,
  onCommit,
}: {
  label: string;
  value: string;
  placeholder?: string;
  testId?: string;
  options?: string[];
  onCommit: (v: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const committed = useRef(value);

  useEffect(() => {
    setDraft(value);
    committed.current = value;
  }, [value]);

  const commit = (v: string) => {
    setEditing(false);
    if (v !== committed.current) {
      committed.current = v;
      onCommit(v);
    }
  };

  if (editing && !options) {
    return (
      <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'flex-start' }}>
        <span style={{ ...fieldLabel, marginTop: 4 }}>{label}：</span>
        <TextArea
          autoFocus
          value={draft}
          data-testid={testId}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => commit(draft)}
          autoSize={{ minRows: 2, maxRows: 6 }}
          style={{ fontSize: 12, background: palette.surface3, flex: 1 }}
        />
      </div>
    );
  }

  if (editing && options) {
    return (
      <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
        <span style={fieldLabel}>{label}：</span>
        <Select
          size="small"
          autoFocus
          defaultOpen
          value={draft || undefined}
          data-testid={testId}
          options={options.map((v) => ({ value: v, label: v }))}
          onChange={(v) => commit(v ?? '')}
          onBlur={() => commit(draft)}
          style={{ minWidth: 100 }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'flex-start' }}>
      <span style={{ ...fieldLabel, marginTop: 1 }}>{label}：</span>
      <span
        role="button"
        tabIndex={0}
        data-testid={testId}
        onClick={() => setEditing(true)}
        onKeyDown={(e) => e.key === 'Enter' && setEditing(true)}
        style={{
          flex: 1,
          fontSize: 12,
          lineHeight: 1.6,
          color: value ? palette.textSub : palette.textDim,
          cursor: 'text',
          wordBreak: 'break-word',
        }}
      >
        {value || placeholder}
      </span>
    </div>
  );
}

/**
 * 右栏一张出图卡（关键帧 / 分镜画面）：主图 + 生成 + 历史记录。
 * 「生成」不再是直接调用，而是打开右侧生成面板（对齐设计稿）。
 */
function ImageCard({
  title,
  url,
  history,
  busy,
  emptyHint,
  testId,
  onOpenPanel,
  videoUrl,
  videoStatus,
}: {
  title: string;
  url: string | null;
  history: { url: string; ts: number }[];
  busy: boolean;
  emptyHint: string;
  testId: string;
  onOpenPanel: () => void;
  videoUrl?: string | null;
  videoStatus?: string;
}) {
  return (
    <div
      data-testid={testId}
      style={{
        borderRadius: 14,
        background: palette.surface,
        border: `1px solid ${palette.border}`,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 220,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <PictureOutlined style={{ color: palette.textDim, fontSize: 12 }} />
        <Text style={{ fontSize: 12, color: palette.textSub }}>{title}</Text>
        {videoStatus && (
          <span
            style={{
              fontSize: 10,
              color: videoStatus === 'completed' ? palette.success : palette.warn,
              marginLeft: 4,
            }}
          >
            视频：{videoStatus}
          </span>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <Tooltip title="添加参考图">
            <Button
              size="small"
              type="text"
              onClick={onOpenPanel}
              style={{
                width: 24,
                height: 24,
                borderRadius: 999,
                background: palette.surface3,
                color: palette.textSub,
              }}
              icon={<PlusOutlined style={{ fontSize: 11 }} />}
            />
          </Tooltip>
          <Button
            size="small"
            data-testid={`${testId}-gen`}
            loading={busy}
            onClick={onOpenPanel}
            icon={<ThunderboltOutlined style={{ fontSize: 11 }} />}
            style={{
              height: 24,
              borderRadius: 999,
              fontSize: 11,
              background: palette.surface3,
              borderColor: palette.borderLight,
              color: palette.text,
            }}
          >
            生成
          </Button>
        </div>
      </div>

      <Text style={{ fontSize: 10, color: palette.textDim, marginTop: 4 }}>
        (关键帧展示片段内容，可选择参考素材，或通过生成)
      </Text>

      <div style={{ display: 'flex', gap: 10, marginTop: 10, flex: 1, minHeight: 140 }}>
        {/* 主图 */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            borderRadius: 10,
            overflow: 'hidden',
            background: '#0e1011',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              data-testid={`${testId}-video`}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : url ? (
            <img
              src={url}
              alt={title}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <div
              style={{
                padding: 20,
                textAlign: 'center',
                color: palette.textDim,
                fontSize: 11,
                lineHeight: 1.8,
              }}
            >
              {emptyHint}
              <div style={{ marginTop: 8 }}>
                <Button
                  size="small"
                  loading={busy}
                  data-testid={`${testId}-gen-empty`}
                  onClick={onOpenPanel}
                  icon={<ThunderboltOutlined style={{ fontSize: 11 }} />}
                  style={{
                    height: 26,
                    borderRadius: 999,
                    fontSize: 11,
                    background: palette.surface3,
                    borderColor: palette.borderLight,
                    color: palette.text,
                  }}
                >
                  生成
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 历史记录 */}
        <div
          style={{
            width: 48,
            flex: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Text style={{ fontSize: 9, color: palette.textDim, whiteSpace: 'nowrap' }}>
            历史记录
          </Text>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              overflowY: 'auto',
              maxHeight: 320,
              width: '100%',
              alignItems: 'center',
            }}
          >
            {history.length === 0 ? (
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  border: `1px dashed ${palette.borderLight}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: palette.textDim,
                  fontSize: 10,
                }}
              >
                <PictureOutlined style={{ opacity: 0.5 }} />
              </div>
            ) : (
              history.map((h) => (
                <div
                  key={h.url}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: `1px solid ${palette.border}`,
                    flex: 'none',
                  }}
                >
                  <img
                    src={h.url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 步骤 3 分集详情（对齐设计稿）：
 *  顶部工具条 → 左列片段缩略图 / 中栏片段与分镜 / 右栏关键帧 + 分镜画面。
 * 「生成」按钮统一打开右侧生成面板（模型 / 风格 / 参考图 / 输出设置）。
 */
export function EpisodeDetailPage({ projectId }: { projectId: number }) {
  const { episodeId: epParam } = useParams();
  const episodeId = Number(epParam);
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();
  const setKeyframes = useEpisodeStore((s) => s.setKeyframes);

  const [detail, setDetail] = useState<EpisodeDetail | null>(null);
  const [segments, setSegments] = useState<KeyframeView[]>([]);
  const [assets, setAssets] = useState<AssetView[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [busy, setBusy] = useState<
    'portrait' | 'shot' | 'video' | 'batch-img' | 'batch-video' | 'add' | null
  >(null);

  // 生成面板状态：kind 决定是「生成图片」还是「生成视频」
  const [panel, setPanel] = useState<{ kind: 'image' | 'video'; target: 'keyframe' | 'shot' } | null>(
    null,
  );
  const [imageSettings, setImageSettings] = useState<GenerateSettings>(DEFAULT_IMAGE_SETTINGS);
  const [videoSettings, setVideoSettings] = useState<GenerateSettings>(DEFAULT_VIDEO_SETTINGS);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [d, list, assetList] = await Promise.all([
        getEpisode(projectId, episodeId).catch(() => null),
        listKeyframes(projectId, episodeId),
        listAssets(projectId).catch(() => [] as AssetView[]),
      ]);
      const arr = Array.isArray(list) ? list : [];
      setDetail(d);
      setSegments(arr);
      setAssets(Array.isArray(assetList) ? assetList : []);
      setKeyframes(arr);
      setActiveId((prev) => (arr.some((s) => s.id === prev) ? prev : arr[0]?.id ?? null));
      setLoadError(null);
    } catch (e: any) {
      setSegments([]);
      setLoadError(e?.message ?? '分集详情加载失败');
    } finally {
      setLoading(false);
    }
  }, [projectId, episodeId, setKeyframes]);

  useEffect(() => {
    if (Number.isNaN(episodeId)) return;
    void load();
  }, [load, episodeId]);

  const active = useMemo(
    () => segments.find((s) => s.id === activeId) ?? segments[0] ?? null,
    [segments, activeId],
  );

  const replaceSeg = (v: KeyframeView) =>
    setSegments((prev) => prev.map((s) => (s.id === v.id ? v : s)));

  /** 生成面板提交：按 kind 走不同接口，并把面板里的参数真正带上。 */
  const submitPanel = async () => {
    if (!active || !panel) return;
    const kind = panel.kind;
    const settings = kind === 'video' ? videoSettings : imageSettings;
    setBusy(kind === 'video' ? 'video' : panel.target === 'keyframe' ? 'portrait' : 'shot');
    try {
      if (kind === 'video') {
        const r = await genKeyframeVideo(projectId, episodeId, active.id, {
          size: settings.size,
          style_prompt: settings.stylePrompt ?? undefined,
          ref_images: settings.refImages,
          seconds: Math.min(Math.max(active.seconds || 5, 4), 12),
        });
        message.success(
          r.reused ? '该镜头已有进行中的视频任务' : '视频任务已提交，完成会提示',
        );
      } else {
        const v = await genKeyframeImage(projectId, episodeId, active.id, panel.target, {
          size: settings.size,
          style_prompt: settings.stylePrompt ?? undefined,
          ref_images: settings.refImages,
        });
        replaceSeg(v);
        message.success(panel.target === 'keyframe' ? '关键帧已生成' : '分镜画面已生成');
      }
      setPanel(null);
    } catch (e: any) {
      message.error(e?.message ?? '生成失败');
    } finally {
      setBusy(null);
    }
  };

  const patchSegment = async (patch: { scene_setting?: string }) => {
    if (!active) return;
    try {
      replaceSeg(await editSegment(projectId, episodeId, active.id, patch));
    } catch (e: any) {
      message.error(e?.message ?? '保存失败');
    }
  };

  const patchShot = async (shotId: string, patch: Partial<SegmentShot>) => {
    if (!active) return;
    // 乐观更新：输入类字段频繁失焦，等接口回来再渲染会有明显回弹
    setSegments((prev) =>
      prev.map((s) =>
        s.id === active.id
          ? { ...s, shots: s.shots.map((x) => (x.id === shotId ? { ...x, ...patch } : x)) }
          : s,
      ),
    );
    try {
      replaceSeg(await editShot(projectId, episodeId, active.id, shotId, patch));
    } catch (e: any) {
      message.error(e?.message ?? '保存分镜失败');
      void load();
    }
  };

  const doAddShot = async (segId?: number) => {
    const target = segId ?? active?.id;
    if (!target || busy) return;
    setBusy('add');
    try {
      const v = await addShot(projectId, episodeId, target, {
        seconds: 4,
        visual: '',
      });
      replaceSeg(v);
      setActiveId(v.id);
    } catch (e: any) {
      message.error(e?.message ?? '添加分镜失败');
    } finally {
      setBusy(null);
    }
  };

  const doRemoveShot = async (shotId: string) => {
    if (!active) return;
    try {
      replaceSeg(await deleteShot(projectId, episodeId, active.id, shotId));
    } catch (e: any) {
      message.error(e?.message ?? '删除分镜失败');
    }
  };

  const doAddSegment = async () => {
    if (busy) return;
    setBusy('add');
    try {
      const v = await addKeyframe(projectId, episodeId, {
        after_keyframe_id: active?.id,
        scene_setting: active?.scene_setting ?? '',
      });
      setSegments((prev) => [...prev, v].sort((a, b) => a.seq - b.seq));
      setActiveId(v.id);
      message.success(`已新增 Segment ${v.seq}`);
    } catch (e: any) {
      message.error(e?.message ?? '新增片段失败');
    } finally {
      setBusy(null);
    }
  };

  const doRemoveSegment = async () => {
    if (!active) return;
    try {
      await deleteKeyframe(projectId, episodeId, active.id);
      message.success('片段已删除');
      await load();
    } catch (e: any) {
      message.error(e?.message ?? '删除片段失败');
    }
  };

  const doBatchImages = async () => {
    setBusy('batch-img');
    try {
      const r = await batchImages(projectId, episodeId, 'keyframe');
      await load();
      message.success(`已为 ${r.processed} 个片段出图`);
    } catch (e: any) {
      message.error(e?.message ?? '批量出图失败');
    } finally {
      setBusy(null);
    }
  };

  const doBatchVideos = async () => {
    setBusy('batch-video');
    try {
      await batchVideos(projectId, episodeId, 6);
      message.success('视频任务已提交，完成会提示');
      await load();
    } catch (e: any) {
      message.error(e?.message ?? '批量生成视频失败');
    } finally {
      setBusy(null);
    }
  };

  const doDownload = async (kind: 'image' | 'video' | 'episode') => {
    try {
      const r: any = await batchDownload(projectId, episodeId, kind);
      if (kind === 'episode' && r?.url) {
        const a = document.createElement('a');
        a.href = r.url;
        a.target = '_blank';
        a.rel = 'noreferrer';
        a.download = `${detail?.title ?? 'episode'}.mp4`;
        a.click();
        message.success('已开始导出');
      } else {
        message.success(`已收集 ${r?.count ?? 0} 个文件`);
      }
    } catch (e: any) {
      message.error(e?.message ?? '导出失败');
    }
  };

  const keyframeHistory = (active?.history ?? []).filter((h) => h.kind === 'keyframe');
  const shotHistory = (active?.history ?? []).filter((h) => h.kind === 'shot');

  return (
    <div data-testid="episode-detail" style={{ padding: '12px 16px 24px' }}>
      {/* 顶部工具条 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          paddingBottom: 10,
          borderBottom: `1px solid ${palette.border}`,
          marginBottom: 12,
          flexWrap: 'wrap',
        }}
      >
        <Text style={{ fontSize: 13, fontWeight: 600, color: palette.text, marginRight: 'auto' }}>
          {detail?.title || `第 ${episodeId} 集`}
          {detail && (
            <Text style={{ fontSize: 11, color: palette.textDim, marginLeft: 8, fontWeight: 400 }}>
              {detail.segment_count} 个片段 / {detail.shot_count} 个分镜 / {detail.total_seconds}s
            </Text>
          )}
        </Text>
        <ToolButton
          testId="batch-gen-images"
          onClick={doBatchImages}
          loading={busy === 'batch-img'}
        >
          批量生成图片
        </ToolButton>
        <ToolButton
          testId="batch-gen-videos"
          onClick={doBatchVideos}
          loading={busy === 'batch-video'}
        >
          批量生成视频
        </ToolButton>
        <ToolButton
          testId="open-video-panel"
          icon={<VideoCameraOutlined />}
          disabled={!active}
          onClick={() => setPanel({ kind: 'video', target: 'keyframe' })}
        >
          生成视频
        </ToolButton>
        <Dropdown
          menu={{
            items: [
              { key: 'image', label: '下载全部图片' },
              { key: 'video', label: '下载全部视频' },
              { key: 'episode', label: '下载整集成片' },
            ],
            onClick: ({ key }) => doDownload(key as 'image' | 'video' | 'episode'),
          }}
        >
          <Button
            size="small"
            data-testid="batch-download"
            style={{
              borderRadius: 999,
              height: 28,
              fontSize: 12,
              background: 'transparent',
              borderColor: palette.borderLight,
              color: palette.text,
            }}
          >
            批量下载
          </Button>
        </Dropdown>
        <ToolButton testId="refresh-progress" onClick={() => void load()}>
          刷新进度
        </ToolButton>
        <ToolButton
          testId="gen-final-video"
          primary
          onClick={() => doDownload('episode')}
        >
          生成最终视频
        </ToolButton>
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
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 12, color: '#ffb3b3', flex: 1 }}>{loadError}</Text>
          <Button size="small" onClick={() => void load()}>
            重试
          </Button>
        </div>
      )}

      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : segments.length === 0 ? (
        <div
          style={{
            marginTop: 40,
            padding: '48px 24px',
            borderRadius: 16,
            border: `1px dashed ${palette.borderLight}`,
            background: palette.surface,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              margin: '0 auto 14px',
              borderRadius: 16,
              background: palette.surface2,
              border: `1px solid ${palette.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: palette.textDim,
            }}
          >
            <VideoCameraOutlined style={{ fontSize: 22 }} />
          </div>
          <Text style={{ display: 'block', fontSize: 13, color: palette.text }}>
            还没有片段
          </Text>
          <Text style={{ display: 'block', fontSize: 12, color: palette.textDim, marginTop: 6 }}>
            可以回到分集列表生成分镜脚本，或直接新增一个片段后手动添加分镜
          </Text>
          <div style={{ marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
            <Button
              type="primary"
              data-testid="empty-add-segment"
              loading={busy === 'add'}
              onClick={doAddSegment}
              icon={<PlusOutlined />}
              style={{ borderRadius: 999, fontWeight: 600 }}
            >
              新增片段
            </Button>
            <Button
              data-testid="empty-back-list"
              onClick={() => navigate('/projects/' + projectId + '/episodes')}
              style={{
                borderRadius: 999,
                background: 'transparent',
                borderColor: palette.borderLight,
              }}
            >
              返回分集列表
            </Button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            gap: 12,
            alignItems: 'stretch',
            minHeight: 'calc(100vh - 150px)',
          }}
        >
          {/* 左列 */}
          <SegmentRail
            segments={segments}
            activeId={active?.id ?? null}
            onSelect={setActiveId}
            onAdd={doAddSegment}
          />

          {/* 中栏 */}
          <div
            style={{
              flex: '1 1 46%',
              minWidth: 320,
              maxWidth: 640,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {active && (
              <SegmentCard
                key={active.id}
                seg={active}
                busy={busy === 'add'}
                onPatchSegment={patchSegment}
                onPatchShot={patchShot}
                onAddShot={() => void doAddShot(active.id)}
                onRemoveShot={doRemoveShot}
                onRemoveSegment={doRemoveSegment}
              />
            )}
            {/* 卡片底部再给一个轻量「添加分镜」入口（设计稿底部的 +） */}
            <div
              role="button"
              tabIndex={0}
              data-testid="segment-add-bottom"
              onClick={() => void doAddShot()}
              onKeyDown={(e) => e.key === 'Enter' && void doAddShot()}
              style={{
                marginTop: 8,
                alignSelf: 'center',
                width: 26,
                height: 26,
                borderRadius: 999,
                border: `1px dashed ${palette.borderLight}`,
                color: palette.textDim,
                fontSize: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: busy === 'add' ? 'wait' : 'pointer',
                flex: 'none',
              }}
            >
              <PlusOutlined style={{ fontSize: 11 }} />
            </div>
          </div>

          {/* 右栏：两卡上下平分可用高度 */}
          <div
            style={{
              flex: '1 1 46%',
              minWidth: 300,
              display: 'grid',
              gridTemplateRows: '1fr 1fr',
              gap: 12,
              minHeight: 460,
            }}
          >
            <ImageCard
              testId="keyframe-card"
              title="关键帧"
              url={active?.keyframe_url ?? null}
              history={keyframeHistory}
              busy={busy === 'portrait'}
              emptyHint="建议先生成分镜图片，以获得更统一的角色形象和更流畅的故事连贯性。"
              onOpenPanel={() => setPanel({ kind: 'image', target: 'keyframe' })}
              videoUrl={active?.video_url ?? null}
              videoStatus={active?.video_status}
            />
            <ImageCard
              testId="shot-card"
              title="分镜画面"
              url={active?.shot_image_url ?? null}
              history={shotHistory}
              busy={busy === 'shot'}
              emptyHint="建议先生成分镜图片，以获得更统一的角色形象和更流畅的故事连贯性。"
              onOpenPanel={() => setPanel({ kind: 'image', target: 'shot' })}
            />
          </div>
        </div>
      )}

      {/* 右侧生成面板（图片 / 视频共用） */}
      <GeneratePanel
        open={panel !== null}
        kind={panel?.kind ?? 'image'}
        segment={active}
        assets={assets}
        settings={panel?.kind === 'video' ? videoSettings : imageSettings}
        busy={busy === 'video' || busy === 'portrait' || busy === 'shot'}
        cost={panel?.kind === 'video' ? 0 : 0}
        onClose={() => setPanel(null)}
        onChange={(patch) => {
          if (panel?.kind === 'video') {
            setVideoSettings((s) => ({ ...s, ...patch }));
          } else {
            setImageSettings((s) => ({ ...s, ...patch }));
          }
        }}
        onSubmit={() => void submitPanel()}
      />
    </div>
  );
}
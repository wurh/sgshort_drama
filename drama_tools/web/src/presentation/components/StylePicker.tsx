import { useEffect, useMemo, useState } from 'react';
import { App as AntdApp, Button, Input, Modal, Spin } from 'antd';
import { CloseOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { listStyles } from '@/infrastructure/api/dramaApi';
import type { StyleItem } from '@/shared/types';
import { palette, pillTabStyle } from '../theme';

const CATS: { key: 'all' | '2d' | '3d' | 'real'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: '2d', label: '2D' },
  { key: '3d', label: '3D' },
  { key: 'real', label: '真人' },
];

/**
 * 风格库弹窗（对齐设计稿）：
 * 顶部分类胶囊（全部/2D/3D/真人），首个为「自定义风格」卡，其后为风格网格。
 */
export function StylePicker({
  open,
  value,
  onClose,
  onPick,
}: {
  open: boolean;
  value: string | null;
  onClose: () => void;
  onPick: (style: StyleItem | null, customPrompt?: string) => void;
}) {
  const { message } = AntdApp.useApp();
  const [cat, setCat] = useState<'all' | '2d' | '3d' | 'real'>('all');
  const [styles, setStyles] = useState<StyleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [customMode, setCustomMode] = useState(false);
  const [customText, setCustomText] = useState('');

  useEffect(() => {
    if (!open) return;
    let alive = true;
    setLoading(true);
    listStyles()
      .then((list) => {
        if (alive) setStyles(Array.isArray(list) ? list : []);
      })
      .catch((e: any) => {
        if (alive) message.error(e?.message ?? '风格库加载失败');
      })
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // message 恒定，不入依赖
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const shown = useMemo(
    () => (cat === 'all' ? styles : styles.filter((s) => s.category === cat)),
    [styles, cat],
  );

  const submitCustom = () => {
    if (!customText.trim()) {
      message.warning('请填写自定义风格描述');
      return;
    }
    onPick(null, customText.trim());
    setCustomMode(false);
    setCustomText('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      closeIcon={<CloseOutlined style={{ color: palette.textSub }} />}
      title={<span style={{ fontSize: 14, fontWeight: 600 }}>风格库</span>}
      styles={{ body: { paddingTop: 4 } }}
    >
      {/* 分类胶囊 */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        {CATS.map((c) => (
          <div
            key={c.key}
            role="tab"
            aria-selected={cat === c.key}
            data-testid={`style-cat-${c.key}`}
            style={pillTabStyle(cat === c.key)}
            onClick={() => setCat(c.key)}
          >
            {c.label}
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>
          <Spin />
        </div>
      ) : (
        <div
          data-testid="style-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(128px, 1fr))',
            gap: 10,
            maxHeight: '58vh',
            overflowY: 'auto',
            paddingRight: 4,
          }}
        >
          {/* 自定义风格置首 */}
          <div
            data-testid="style-custom"
            onClick={() => setCustomMode(true)}
            style={{
              position: 'relative',
              aspectRatio: '3 / 4',
              borderRadius: 12,
              background: '#101314',
              border: `1px solid ${customMode ? palette.primary : palette.borderLight}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 999,
                border: `1px solid ${palette.textSub}`,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: palette.textSub,
              }}
            >
              <PlusOutlined style={{ fontSize: 12 }} />
            </span>
            <span style={{ fontSize: 12, color: palette.textSub }}>自定义风格</span>
          </div>

          {shown.map((s) => {
            const active = value === s.key;
            return (
              <div
                key={s.key}
                data-testid={`style-item-${s.key}`}
                onClick={() => {
                  onPick(s);
                  onClose();
                }}
                style={{
                  position: 'relative',
                  aspectRatio: '3 / 4',
                  borderRadius: 12,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  // 用「同色系多层渐变 + 光斑」模拟风格缩略图，避免纯色块被当成坏图
                  background: `
                    radial-gradient(circle at 30% 20%, ${s.tint}cc 0%, transparent 55%),
                    radial-gradient(circle at 70% 75%, ${s.tint}88 0%, transparent 50%),
                    linear-gradient(160deg, #1a1f21 0%, #0d1011 100%)
                  `,
                  border: `1px solid ${active ? palette.primary : palette.border}`,
                  boxShadow: active ? `0 0 0 1px ${palette.primary}` : 'none',
                }}
              >
                {s.category === 'real' ? (
                  <UserOutlined
                    style={{
                      position: 'absolute',
                      top: '44%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: 34,
                      color: 'rgba(255,255,255,.14)',
                    }}
                  />
                ) : (
                  <span
                    style={{
                      position: 'absolute',
                      top: '42%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: 15,
                      fontWeight: 800,
                      letterSpacing: 2,
                      color: 'rgba(255,255,255,.14)',
                    }}
                  >
                    {s.category === '3d' ? '3D' : '2D'}
                  </span>
                )}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: '16px 8px 7px',
                    background: 'linear-gradient(to top, rgba(0,0,0,.85), transparent)',
                    fontSize: 11,
                    color: '#e9ecee',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {s.name}
                </div>
                {active && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 18,
                      height: 18,
                      borderRadius: 999,
                      background: palette.primary,
                      color: '#04201e',
                      fontSize: 10,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {customMode && (
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <Input
            autoFocus
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="描述你想要的风格，如：港风霓虹、低饱和青橙调"
            onPressEnter={submitCustom}
            data-testid="style-custom-input"
          />
          <Button type="primary" onClick={submitCustom}>
            使用
          </Button>
        </div>
      )}
    </Modal>
  );
}
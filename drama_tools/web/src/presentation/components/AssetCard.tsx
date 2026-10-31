import { useState } from 'react';
import { Card, Button, Space, Tag, Switch, Tooltip, message, Alert } from 'antd';
import {
  generateAssetBase,
  addAssetImage,
  toggleAssetSync,
} from '@/infrastructure/api/dramaApi';
import type { AssetView } from '@/shared/types';

/** 资产卡片：基础形象 + 添加形象(多视图) + 再次生成 + 同步开关。M-E / TC-AS。 */
export function AssetCard({
  asset,
  projectId,
  onChanged,
}: {
  asset: AssetView;
  projectId: number;
  onChanged: (a: AssetView) => void;
}) {
  // 本地 pending 兜底：接口未回包前也能立即显示 loading，避免"点了没反应"
  const [pending, setPending] = useState(false);
  const busy = pending || asset.status === 'generating';
  const failed = asset.status === 'failed';

  const run = async (fn: () => Promise<AssetView>) => {
    setPending(true);
    try {
      onChanged(await fn());
    } catch (e: any) {
      message.error(e?.message ?? '操作失败');
    } finally {
      setPending(false);
    }
  };

  const regen = () => run(() => generateAssetBase(projectId, asset.id));
  const add = () => run(() => addAssetImage(projectId, asset.id));
  const sync = (v: boolean) => run(() => toggleAssetSync(projectId, asset.id, v));

  const img = asset.base_image_url || asset.extra_images[0] || null;
  return (
    <Card
      size="small"
      data-testid={`asset-card-${asset.id}`}
      style={{ width: 220 }}
      title={
        <Space size={4}>
          <span style={{ fontWeight: 600 }}>{asset.name}</span>
          <Tag color={asset.type === 'character' ? 'blue' : asset.type === 'scene' ? 'green' : 'gold'}>
            {asset.type === 'character' ? '角色' : asset.type === 'scene' ? '场景' : '道具'}
          </Tag>
        </Space>
      }
      extra={
        <Space size={4}>
          <span style={{ fontSize: 11, color: '#888' }}>
            {img ? `${asset.image_count} 张` : '0 张'}
          </span>
          <Switch size="small" checked={asset.sync_enabled} onChange={sync} />
        </Space>
      }
    >
      <div
        style={{
          height: 150,
          background: '#fafafa',
          border: '1px dashed #e5e5e5',
          borderRadius: 6,
          overflow: 'hidden',
          marginBottom: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {img ? (
          <img
            src={img}
            alt={asset.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = 'none';
            }}
          />
        ) : (
          <span style={{ color: '#bbb', fontSize: 12 }}>
            {busy ? '生成中…' : failed ? '生成失败' : '未生成基础形象'}
          </span>
        )}
      </div>

      {failed && asset.error && (
        <Alert
          type="error"
          showIcon
          style={{ marginBottom: 6, padding: '2px 8px', fontSize: 11 }}
          message={
            <span style={{ fontSize: 11, wordBreak: 'break-all' }}>
              {asset.error.length > 80 ? `${asset.error.slice(0, 80)}…` : asset.error}
            </span>
          }
        />
      )}

      <Space wrap>
        <Button
          size="small"
          type="primary"
          loading={busy}
          onClick={regen}
          disabled={busy}
          data-testid={`asset-gen-${asset.id}`}
        >
          {img ? '再次生成' : failed ? '重试生成' : '生成基础形象'}
        </Button>
        <Button size="small" onClick={add} disabled={busy}>
          + 添加形象
        </Button>
        {img ? (
          <Tooltip title={asset.base_image_url ?? undefined}>
            <Button size="small" ghost type="primary" href={img} target="_blank">
              查看
            </Button>
          </Tooltip>
        ) : null}
      </Space>
    </Card>
  );
}
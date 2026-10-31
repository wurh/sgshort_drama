import { describe, it, expect, beforeEach } from 'vitest';
import { useAssetStore } from '@/application/stores/assetStore';
import type { AssetView } from '@/shared/types';
import { makeAsset } from '@/test/fixtures';

/** UT-FE-06 assetStore.toggleSync：关闭"同步资产"清除该资产 refs 标记。 */
describe('useAssetStore.toggleSync', () => {
  beforeEach(() => useAssetStore.getState().setAssets([]));

  const asset = (id: number, sync = true): AssetView =>
    makeAsset({ id, name: `A${id}`, sync_enabled: sync, status: 'done' });

  it('关闭同步 → 清除该资产 refs 标记', () => {
    useAssetStore.getState().setAssets([asset(1, true), asset(2, true)]);
    useAssetStore.getState().updateAsset(asset(1));
    expect(useAssetStore.getState().syncedRefs[1]).toBe(true);

    useAssetStore.getState().toggleSync(1, false);
    const s = useAssetStore.getState();
    expect(s.syncedRefs[1]).toBeUndefined();
    expect(s.syncedRefs[2]).toBe(true); // 其他保留
    expect(s.assets.find((a) => a.id === 1)?.sync_enabled).toBe(false);
  });

  it('开启同步 → 写入 refs 标记', () => {
    useAssetStore.getState().setAssets([asset(5, false)]);
    useAssetStore.getState().toggleSync(5, true);
    expect(useAssetStore.getState().syncedRefs[5]).toBe(true);
    expect(useAssetStore.getState().assets[0].sync_enabled).toBe(true);
  });

  it('自动同步开关独立', () => {
    useAssetStore.getState().setAutoSync(true);
    expect(useAssetStore.getState().autoSync).toBe(true);
  });
});

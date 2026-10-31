import { create } from 'zustand';
import type { AssetView } from '@/shared/types';

/**
 * 资产库状态（复刻 sghouse houseStore）：三类资产 + 同步开关。
 * UT-FE-06：toggleSync 关闭"同步资产"清除该资产引用标记；自动同步开启时 refs 更新。
 */
interface AssetState {
  assets: AssetView[];
  /** 被镜头引用、开启同步的资产 id 集合（refs 注入标记）。 */
  syncedRefs: Record<number, boolean>;
  setAssets: (list: AssetView[]) => void;
  updateAsset: (a: AssetView) => void;
  toggleSync: (assetId: number, sync: boolean) => void;
  autoSync: boolean;
  setAutoSync: (v: boolean) => void;
}

export const useAssetStore = create<AssetState>((set) => ({
  assets: [],
  syncedRefs: {},
  autoSync: false,
  setAssets: (list) =>
    set({
      assets: list,
      syncedRefs: Object.fromEntries(
        list.filter((a) => a.sync_enabled).map((a) => [a.id, true]),
      ),
    }),
  updateAsset: (a) =>
    set((s) => ({
      assets: s.assets.map((x) => (x.id === a.id ? a : x)),
      syncedRefs: { ...s.syncedRefs, [a.id]: a.sync_enabled },
    })),
  toggleSync: (assetId, sync) =>
    set((s) => {
      const syncedRefs = { ...s.syncedRefs };
      if (sync) syncedRefs[assetId] = true;
      else delete syncedRefs[assetId];
      return {
        assets: s.assets.map((a) => (a.id === assetId ? { ...a, sync_enabled: sync } : a)),
        syncedRefs,
      };
    }),
  setAutoSync: (v) => set({ autoSync: v }),
}));

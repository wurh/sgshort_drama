import {
  MAX_HISTORY,
  addShot,
  chunkShots,
  newShot,
  normalizeShot,
  parseHistory,
  parseShots,
  patchShot,
  pushHistory,
  removeShot,
  shotsSeconds,
  stringifyShots,
} from './segments';

/**
 * 片段/分镜模型的纯函数单测。
 * 这些函数决定了详情页中栏能否稳定编辑、时长统计是否一致。
 */
describe('segments 分镜模型', () => {
  describe('newShot / normalizeShot', () => {
    it('缺字段时给安全默认值（不产出 undefined）', () => {
      const s = newShot();
      expect(s.id).toMatch(/^shot-/);
      expect(s.seconds).toBe(4);
      expect(s.shot_size).toBe('');
      expect(s.visual).toBe('');
    });

    it('normalizeShot 保留原有 id（保证前后端引用稳定）', () => {
      const s = normalizeShot({ id: 'fixed-1', seconds: 6, visual: '街口' });
      expect(s.id).toBe('fixed-1');
      expect(s.seconds).toBe(6);
      expect(s.visual).toBe('街口');
    });

    it('normalizeShot 对非法时长回落默认值', () => {
      expect(normalizeShot({ seconds: -3 }).seconds).toBe(4);
      expect(normalizeShot({ seconds: 'abc' }).seconds).toBe(4);
    });
  });

  describe('parseShots / stringifyShots', () => {
    it('空值返回空数组，不抛', () => {
      expect(parseShots(null)).toEqual([]);
      expect(parseShots('')).toEqual([]);
    });

    it('非法 JSON 返回空数组（不炸整个详情接口）', () => {
      expect(parseShots('{bad json')).toEqual([]);
      expect(parseShots('123')).toEqual([]);
    });

    it('序列化后能原样读回', () => {
      const list = [newShot({ seconds: 3, visual: 'a' }), newShot({ seconds: 5, visual: 'b' })];
      const back = parseShots(stringifyShots(list));
      expect(back).toHaveLength(2);
      expect(back[0].id).toBe(list[0].id);
      expect(back[1].visual).toBe('b');
    });
  });

  describe('增删改', () => {
    it('addShot 追加到末尾', () => {
      const a = newShot({ id: 'a', seconds: 2 });
      const list = addShot([a], { id: 'b', seconds: 3 });
      expect(list.map((s) => s.id)).toEqual(['a', 'b']);
      expect(shotsSeconds(list)).toBe(5);
    });

    it('patchShot 只改命中的分镜，且不允许把 id 改成空', () => {
      const list = [newShot({ id: 'a', visual: 'old' }), newShot({ id: 'b' })];
      const next = patchShot(list, 'a', { visual: 'new', id: '' });
      expect(next[0].visual).toBe('new');
      expect(next[0].id).toBe('a');
      expect(next[1].visual).toBe('');
    });

    it('patchShot 对未命中的 id 不改动任何内容', () => {
      const list = [newShot({ id: 'a', visual: 'x' })];
      expect(patchShot(list, 'zzz', { visual: 'y' })[0].visual).toBe('x');
    });

    it('removeShot 按 id 删除', () => {
      const list = [newShot({ id: 'a' }), newShot({ id: 'b' })];
      expect(removeShot(list, 'a').map((s) => s.id)).toEqual(['b']);
    });

    it('shotsSeconds 汇总时长', () => {
      expect(shotsSeconds([newShot({ seconds: 3 }), newShot({ seconds: 4 })])).toBe(7);
      expect(shotsSeconds([])).toBe(0);
    });
  });

  describe('历史记录', () => {
    it('最新的排最前，同一 url 不重复入栈', () => {
      const h1 = pushHistory([], { kind: 'keyframe', url: 'u1', ts: 1 });
      const h2 = pushHistory(h1, { kind: 'keyframe', url: 'u2', ts: 2 });
      const h3 = pushHistory(h2, { kind: 'keyframe', url: 'u1', ts: 3 });
      expect(h3.map((x) => x.url)).toEqual(['u1', 'u2']);
      expect(h3[0].ts).toBe(3);
    });

    it('超过上限时丢最旧', () => {
      let h = [] as ReturnType<typeof parseHistory>;
      for (let i = 0; i < MAX_HISTORY + 3; i++) {
        h = pushHistory(h, { kind: 'shot', url: `u${i}`, ts: i });
      }
      expect(h).toHaveLength(MAX_HISTORY);
      expect(h[0].url).toBe(`u${MAX_HISTORY + 2}`);
    });

    it('空 url 不入栈', () => {
      expect(pushHistory([], { kind: 'shot', url: '', ts: 1 })).toEqual([]);
    });

    it('parseHistory 容忍脏数据', () => {
      expect(parseHistory(null)).toEqual([]);
      expect(parseHistory('nope')).toEqual([]);
      expect(parseHistory(JSON.stringify([{ url: 'a' }, { url: '' }, {}]))).toEqual([
        { kind: 'keyframe', url: 'a', ts: 0 },
      ]);
    });
  });

  describe('chunkShots 片段归并', () => {
    it('按每组上限切分', () => {
      expect(chunkShots([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('不足一组时返回单组', () => {
      expect(chunkShots([1], 2)).toEqual([[1]]);
    });

    it('空列表返回空数组', () => {
      expect(chunkShots([], 2)).toEqual([]);
    });

    it('非法 maxPer 至少按 1 处理（不产生死循环）', () => {
      expect(chunkShots([1, 2], 0)).toEqual([[1], [2]]);
    });
  });
});
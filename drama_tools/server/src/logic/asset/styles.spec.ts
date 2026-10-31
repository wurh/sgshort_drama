import { STYLE_LIBRARY, findStyle, listStyles } from './styles';

/** UT-BE-14 风格库清单。 */
describe('风格库 styles', () => {
  it('内置风格 key 唯一（避免前端 tab 选中态错乱）', () => {
    const keys = STYLE_LIBRARY.map((s) => s.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('三个分类都有条目，保证风格库弹窗三个 tab 不空', () => {
    for (const c of ['2d', '3d', 'real'] as const) {
      expect(listStyles(c).length).toBeGreaterThan(0);
    }
  });

  it('listStyles 无参 / all 返回全量', () => {
    expect(listStyles().length).toBe(STYLE_LIBRARY.length);
    expect(listStyles('all').length).toBe(STYLE_LIBRARY.length);
  });

  it('listStyles 按分类过滤', () => {
    const reals = listStyles('real');
    expect(reals.every((s) => s.category === 'real')).toBe(true);
    expect(reals.length).toBeLessThan(STYLE_LIBRARY.length);
  });

  it('未知分类返回空数组（不报错）', () => {
    expect(listStyles('nope')).toEqual([]);
  });

  it('findStyle 命中与未命中', () => {
    expect(findStyle('real-film')?.name).toBe('港风电影写实风');
    expect(findStyle('no-such')).toBeUndefined();
    expect(findStyle(null)).toBeUndefined();
  });

  it('每个风格都有非空 prompt 与 tint（渲染占位需要）', () => {
    for (const s of STYLE_LIBRARY) {
      expect(s.prompt.length).toBeGreaterThan(4);
      expect(s.tint).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(s.name.length).toBeGreaterThan(1);
    }
  });
});
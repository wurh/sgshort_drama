import { pickRefImages } from './ref-pick';

/** UT-BE-06 pickRefImages（优先级 角色 > 场景 > 道具，maxImages 截断）。 */
describe('pickRefImages', () => {
  it('按优先级截断到 maxImages', () => {
    const chars = ['c1', 'c2', 'c3'];
    const scenes = ['s1', 's2'];
    const props = ['p1'];
    const r = pickRefImages(chars, scenes, props, 5);
    expect(r).toHaveLength(5);
    expect(r[0]).toBe('c1');
    expect(r[2]).toBe('c3'); // 角色优先
    expect(r[3]).toBe('s1'); // 场景其次
  });

  it('去重', () => {
    const r = pickRefImages(['a', 'a'], ['b'], [], 5);
    expect(r).toEqual(['a', 'b']);
  });

  it('过滤空值', () => {
    const r = pickRefImages(['a', '', null as unknown as string], [], [], 5);
    expect(r).toEqual(['a']);
  });

  it('默认 maxImages=5', () => {
    const r = pickRefImages(['1', '2', '3', '4', '5', '6', '7'], [], [], undefined);
    expect(r).toHaveLength(5);
  });
});

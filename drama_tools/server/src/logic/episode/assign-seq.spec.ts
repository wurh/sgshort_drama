import { assignKeyframeSeq } from './assign-seq';

/** UT-BE-07 assignKeyframeSeq（连续递增 + 删除复用最小空洞）。 */
describe('assignKeyframeSeq', () => {
  it('空列表 → 1', () => {
    expect(assignKeyframeSeq([])).toBe(1);
  });

  it('连续插入 seq 递增', () => {
    expect(assignKeyframeSeq([1])).toBe(2);
    expect(assignKeyframeSeq([1, 2, 3])).toBe(4);
  });

  it('删除后复用最小空洞', () => {
    // 现有 [1,2,3,4,5]，删除 2 与 4 → 空洞 2、4，复用最小 2
    expect(assignKeyframeSeq([1, 3, 5])).toBe(2);
  });

  it('忽略非法值', () => {
    expect(assignKeyframeSeq([0, -1, 2, 3])).toBe(1); // 0/-1 无效，从 1 起空洞
  });
});

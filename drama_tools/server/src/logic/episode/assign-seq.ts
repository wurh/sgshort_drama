/**
 * 为新镜头分配 seq（复刻 sghouse assignSlot 语义，UT-BE-07）：
 * - 连续插入时取当前最大 seq + 1。
 * - 删除后复用最小空洞（gap reuse）。
 * @param existingSeqs 当前已存在的 seq 列表
 * @returns 下一个可用的 seq（从 1 起）
 */
export function assignKeyframeSeq(existingSeqs: number[]): number {
  if (!existingSeqs || existingSeqs.length === 0) return 1;
  const set = new Set(existingSeqs.filter((s) => Number.isInteger(s) && s >= 1));
  // 复用最小空洞
  for (let i = 1; ; i++) {
    if (!set.has(i)) return i;
  }
}

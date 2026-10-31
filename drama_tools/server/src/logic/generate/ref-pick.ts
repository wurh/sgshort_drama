/**
 * 按 "主要角色 > 场景 > 道具" 优先级 + maxImages(默认 5) 截断，
 * 产出 Agnes extra_body.image 参考图数组（UT-BE-06）。
 */
export function pickRefImages(
  characterImages: string[] = [],
  sceneImages: string[] = [],
  propImages: string[] = [],
  maxImages = 5,
): string[] {
  const clean = (arr: string[]) => arr.filter((u) => typeof u === 'string' && u.length > 0);
  const priority = [...clean(characterImages), ...clean(sceneImages), ...clean(propImages)];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const u of priority) {
    if (out.length >= maxImages) break;
    if (!seen.has(u)) {
      seen.add(u);
      out.push(u);
    }
  }
  return out;
}

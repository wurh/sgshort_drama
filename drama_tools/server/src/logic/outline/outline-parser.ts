import { OutlineResult, OutlineEpisode } from '../generate/types';

/**
 * 从 LLM 文本解析剧本大纲 JSON（UT-BE-01）。
 * - 容忍 ```json 包裹与前后噪声（复刻 sghouse parseListJson）。
 * - 规范化 episodes/characters/scenes/props 四类，缺省补 []。
 * - 非法（无 JSON / 非对象）返回 null，不抛。
 */
export function parseOutlineJson(text: string): OutlineResult | null {
  if (!text) return null;
  let s = text.trim();
  s = s.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  const start = s.indexOf('{');
  const end = s.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;
  s = s.slice(start, end + 1);
  try {
    const obj = JSON.parse(s);
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return null;
    return normalizeOutline(obj);
  } catch {
    return null;
  }
}

function strArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => (typeof x === 'string' ? x : x && typeof x.name === 'string' ? (x as { name: string }).name : String(x))).filter(Boolean);
}

function normalizeOutline(obj: any): OutlineResult {
  const rawEps: any[] = Array.isArray(obj.episodes) ? obj.episodes : [];
  const episodes: OutlineEpisode[] = rawEps.map((e, i) => ({
    title: typeof e?.title === 'string' ? e.title : `第${i + 1}集`,
    summary: typeof e?.summary === 'string' ? e.summary : '',
    seconds: typeof e?.seconds === 'number' ? e.seconds : 90,
    characters: strArray(e?.characters),
    scenes: strArray(e?.scenes),
  }));
  const characters = (Array.isArray(obj.characters) ? obj.characters : []).map((c: any) => ({
    name: typeof c?.name === 'string' ? c.name : '未命名角色',
    desc: typeof c?.desc === 'string' ? c.desc : '',
    tags: Array.isArray(c?.tags) ? c.tags.map(String) : [],
  }));
  const scenes = (Array.isArray(obj.scenes) ? obj.scenes : []).map((c: any) => ({
    name: typeof c?.name === 'string' ? c.name : '未命名场景',
    desc: typeof c?.desc === 'string' ? c.desc : '',
  }));
  const props = (Array.isArray(obj.props) ? obj.props : []).map((c: any) => ({
    name: typeof c?.name === 'string' ? c.name : '未命名道具',
    desc: typeof c?.desc === 'string' ? c.desc : '',
  }));
  return { episodes, characters, scenes, props };
}

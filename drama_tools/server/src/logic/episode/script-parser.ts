import { KeyframeScript } from '../generate/types';

/**
 * 从 LLM 文本解析分镜脚本 JSON（UT-BE-02）。
 * - 期望 { shots: [ {seq, shot_type, camera, seconds, visual_desc, dialogue, characters[], scenes[], props[]} ] }
 *   也容忍顶层直接是数组。
 * - 缺关键字段（visual_desc）或无 JSON 时返回 null，不抛。
 */
export function parseScriptJson(text: string): KeyframeScript[] | null {
  if (!text) return null;
  let s = text.trim();
  s = s.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  // 可能顶层是数组，也可能是 {shots:[...]}
  let start = s.indexOf('{');
  let end = s.lastIndexOf('}');
  let arrStart = s.indexOf('[');
  if (arrStart !== -1 && (start === -1 || arrStart < start)) {
    start = arrStart;
    end = s.lastIndexOf(']');
  }
  if (start === -1 || end === -1 || end <= start) return null;
  s = s.slice(start, end + 1);
  let obj: any;
  try {
    obj = JSON.parse(s);
  } catch {
    return null;
  }
  const raw = Array.isArray(obj) ? obj : Array.isArray(obj?.shots) ? obj.shots : null;
  if (!raw) return null;
  const list = raw.map((it: any, i: number): KeyframeScript => ({
    seq: typeof it?.seq === 'number' ? it.seq : i + 1,
    shot_type: typeof it?.shot_type === 'string' ? it.shot_type : '',
    camera: typeof it?.camera === 'string' ? it.camera : '',
    seconds: typeof it?.seconds === 'number' ? it.seconds : 8,
    visual_desc: typeof it?.visual_desc === 'string' ? it.visual_desc : '',
    dialogue: typeof it?.dialogue === 'string' ? it.dialogue : '',
    characters: toNames(it?.characters),
    scenes: toNames(it?.scenes),
    props: toNames(it?.props),
  }));
  // 每条至少要有画面描述，否则视为非法
  if (list.length === 0) return null;
  return list;
}

function toNames(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x) => (typeof x === 'string' ? x : x && typeof x.name === 'string' ? (x as { name: string }).name : String(x)))
    .filter(Boolean);
}

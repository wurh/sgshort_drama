import { parseOutlineJson } from './outline-parser';

/** UT-BE-01 parseOutlineJson。 */
describe('parseOutlineJson', () => {
  it('解析标准 JSON 大纲', () => {
    const json = JSON.stringify({
      episodes: [{ title: '第1集', summary: '开场', seconds: 90, characters: ['阿强'], scenes: ['街头'] }],
      characters: [{ name: '阿强', desc: '主角' }],
      scenes: [{ name: '街头', desc: '城市' }],
      props: [{ name: '雨伞', desc: '道具' }],
    });
    const r = parseOutlineJson(json)!;
    expect(r.episodes.length).toBe(1);
    expect(r.episodes[0].title).toBe('第1集');
    expect(r.characters[0].name).toBe('阿强');
    expect(r.scenes[0].name).toBe('街头');
    expect(r.props[0].name).toBe('雨伞');
  });

  it('容忍 ```json 包裹与前后噪声', () => {
    const text = '好的，以下是大纲：\n```json\n' +
      '{"episodes":[{"title":"E1","summary":"s","seconds":60,"characters":[],"scenes":[]}],"characters":[],"scenes":[],"props":[]}\n' +
      '```\n希望有帮助';
    const r = parseOutlineJson(text)!;
    expect(r.episodes[0].title).toBe('E1');
    expect(r.episodes[0].seconds).toBe(60);
  });

  it('缺省类自动补 []', () => {
    const r = parseOutlineJson('{"episodes":[]}')!;
    expect(r.characters).toEqual([]);
    expect(r.scenes).toEqual([]);
    expect(r.props).toEqual([]);
  });

  it('无 JSON → null（不抛）', () => {
    expect(parseOutlineJson('这是一段自由文本，没有 JSON')).toBeNull();
    expect(parseOutlineJson('')).toBeNull();
  });

  it('JSON 损坏 → null', () => {
    expect(parseOutlineJson('{"episodes": [')).toBeNull();
  });
});

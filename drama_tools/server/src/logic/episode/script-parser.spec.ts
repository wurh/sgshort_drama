import { parseScriptJson } from './script-parser';

/** UT-BE-02 parseScriptJson。 */
describe('parseScriptJson', () => {
  it('解析 {shots:[...]} 结构', () => {
    const json = JSON.stringify({
      shots: [
        { seq: 1, shot_type: '特写', camera: '推镜', seconds: 6, visual_desc: '主角握伞', dialogue: '走吧', characters: ['阿强'], scenes: ['街头'], props: ['雨伞'] },
      ],
    });
    const r = parseScriptJson(json)!;
    expect(r.length).toBe(1);
    expect(r[0].seq).toBe(1);
    expect(r[0].visual_desc).toBe('主角握伞');
    expect(r[0].characters).toEqual(['阿强']);
  });

  it('容忍顶层直接是数组 + ```json 包裹', () => {
    const text = '```json\n[{"seq":1,"visual_desc":"开场"}]\n```';
    const r = parseScriptJson(text)!;
    expect(r.length).toBe(1);
    expect(r[0].visual_desc).toBe('开场');
    expect(r[0].seconds).toBe(8); // 缺省
  });

  it('缺关键字段 / 无 JSON → null', () => {
    expect(parseScriptJson('不是JSON')).toBeNull();
    expect(parseScriptJson('{"foo":1}')).toBeNull();
    expect(parseScriptJson('')).toBeNull();
  });
});

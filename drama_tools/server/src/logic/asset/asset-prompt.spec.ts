import { buildAssetPrompt, buildSheetPrompt, normalizeRatio } from './asset-prompt';

/** UT-BE-03 buildAssetPrompt。 */
describe('buildAssetPrompt', () => {
  it('角色 → 3:4 ratio', () => {
    const r = buildAssetPrompt({ name: '阿强', desc: '主角' }, 'character', '写实');
    expect(r.ratio).toBe('3:4');
    expect(r.size).toBe('1K');
    expect(r.prompt).toContain('阿强');
    expect(r.prompt).toContain('写实');
  });

  it('场景 → 16:9 ratio', () => {
    const r = buildAssetPrompt({ name: '街头' }, 'scene');
    expect(r.ratio).toBe('16:9');
  });

  it('道具 → 16:9 ratio', () => {
    const r = buildAssetPrompt({ name: '雨伞' }, 'prop');
    expect(r.ratio).toBe('16:9');
  });

  it('prompt 含质量约束', () => {
    const r = buildAssetPrompt({ name: '阿强' }, 'character');
    expect(r.prompt).toContain('高质量');
  });

  it('场景 prompt 要求宽幅全景（不是「半身立绘」）', () => {
    const r = buildAssetPrompt({ name: '破旧街巷' }, 'scene');
    expect(r.prompt).toContain('宽幅全景');
    expect(r.prompt).not.toContain('半身立绘');
  });

  it('道具 prompt 要求静物特写（不是「半身立绘」）', () => {
    const r = buildAssetPrompt({ name: '折叠眼镜' }, 'prop');
    expect(r.prompt).toContain('静物特写');
    expect(r.prompt).not.toContain('半身立绘');
  });
});

/** UT-BE-03b 比例档位校验：场景页的比例控件靠它生效。 */
describe('normalizeRatio', () => {
  it('接受支持的档位', () => {
    expect(normalizeRatio('16:9')).toBe('16:9');
    expect(normalizeRatio('1:1')).toBe('1:1');
    expect(normalizeRatio('3:4')).toBe('3:4');
  });

  it('缺省 / 非法值返回 null（由调用方回落到类型默认比例）', () => {
    expect(normalizeRatio(undefined)).toBeNull();
    expect(normalizeRatio(null)).toBeNull();
    expect(normalizeRatio('')).toBeNull();
    expect(normalizeRatio('5:7')).toBeNull();
    expect(normalizeRatio('16x9')).toBeNull();
  });
});

/** 场景/道具不该有「四视图」概念。 */
describe('buildSheetPrompt', () => {
  it('角色四视图明确要求并排三视图 + 白底', () => {
    const r = buildSheetPrompt({ name: '阿强' }, 'character');
    expect(r.prompt).toContain('四视图');
    expect(r.prompt).toContain('纯白背景');
    expect(r.ratio).toBe('16:9');
  });
});

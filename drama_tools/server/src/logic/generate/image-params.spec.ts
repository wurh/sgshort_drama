import { buildImageParams, normalizeImageSize } from './image-params';

/** UT-BE-04 buildImageParams。 */
describe('buildImageParams', () => {
  it('extra_body.image 为数组且 response_format 在 extra_body 内', () => {
    const p = buildImageParams(['a.png', 'b.png'], { ratio: '3:4' });
    expect(Array.isArray(p.extra_body.image)).toBe(true);
    expect(p.extra_body.image).toEqual(['a.png', 'b.png']);
    expect(p.extra_body.response_format).toBe('url');
    // response_format 必在 extra_body 内，绝不在顶层
    expect((p as any).response_format).toBeUndefined();
  });

  it('过滤空字符串参考图', () => {
    const p = buildImageParams(['a.png', '', ''], {});
    expect(p.extra_body.image).toEqual(['a.png']);
  });

  it('默认 size=1K，model 固定', () => {
    const p = buildImageParams([], {});
    expect(p.model).toBe('agnes-image-2.5-flash');
    expect(p.size).toBe('1K');
  });

  it('无参考图时省略 extra_body.image（上游拒绝空数组）', () => {
    const p = buildImageParams([], { ratio: '3:4' });
    expect(p.extra_body).not.toHaveProperty('image');
    expect(p.extra_body.response_format).toBe('url');
    expect(p.ratio).toBe('3:4');
  });
});

/** 生成面板「输出设置」的分辨率档位。 */
describe('normalizeImageSize', () => {
  it('接受 1K / 2K / 4K，大小写不敏感', () => {
    expect(normalizeImageSize('1K')).toBe('1K');
    expect(normalizeImageSize('2k')).toBe('2K');
    expect(normalizeImageSize(' 4k ')).toBe('4K');
  });

  it('非法值回落 1K，不抛错（脏数据不能让整次生成失败）', () => {
    expect(normalizeImageSize('8K')).toBe('1K');
    expect(normalizeImageSize('huge')).toBe('1K');
    expect(normalizeImageSize('')).toBe('1K');
    expect(normalizeImageSize(undefined)).toBe('1K');
    expect(normalizeImageSize(null)).toBe('1K');
  });

  it('buildImageParams 透传 size', () => {
    expect(buildImageParams([], { size: '2K' }).size).toBe('2K');
    expect(buildImageParams([], { size: 'nope' }).size).toBe('1K');
  });
});

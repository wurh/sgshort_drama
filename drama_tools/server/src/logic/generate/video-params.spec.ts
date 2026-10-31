import { buildVideoParams, normalizeVideoSize } from './video-params';

/** UT-BE-05 buildVideoParams。 */
describe('buildVideoParams', () => {
  it('keyframe 模式：size=720P，first_frame 必填', () => {
    const p = buildVideoParams({ firstFrame: 'f.png', seconds: 6 });
    expect(p.mode).toBe('keyframe');
    expect(p.size).toBe('720P');
    expect(p.first_frame).toBe('f.png');
    expect(p.seconds).toBe('6');
  });

  it('first_frame 与 last_frame 至少其一', () => {
    expect(() => buildVideoParams({ seconds: 6 })).toThrow();
    const ok = buildVideoParams({ lastFrame: 'l.png', seconds: 6 });
    expect(ok.last_frame).toBe('l.png');
  });

  it('seconds 越界抛错', () => {
    expect(() => buildVideoParams({ firstFrame: 'f.png', seconds: 3 })).toThrow('out of range');
    expect(() => buildVideoParams({ firstFrame: 'f.png', seconds: 20 })).toThrow('out of range');
  });

  it('images>5 截断到 5，禁传 videos', () => {
    const many = ['1', '2', '3', '4', '5', '6', '7'];
    const p = buildVideoParams({ firstFrame: 'f.png', seconds: 6, images: many });
    expect(p.images).toHaveLength(5);
    expect(() => buildVideoParams({ firstFrame: 'f.png', seconds: 6, videos: ['v.mp4'] })).toThrow(
      'videos reference is disabled',
    );
  });
});

/** 生成面板「输出设置」：720p / 1080p。 */
describe('normalizeVideoSize', () => {
  it('小写 720p / 1080p 折算成 Agnes 要的大写形式', () => {
    expect(normalizeVideoSize('720p')).toBe('720P');
    expect(normalizeVideoSize('1080p')).toBe('1080P');
    expect(normalizeVideoSize('1080')).toBe('1080P');
    expect(normalizeVideoSize(' 720P ')).toBe('720P');
  });

  it('不支持的档位回落 720P，不抛错', () => {
    expect(normalizeVideoSize('4K')).toBe('720P');
    expect(normalizeVideoSize('2160p')).toBe('720P');
    expect(normalizeVideoSize(undefined)).toBe('720P');
    expect(normalizeVideoSize(null)).toBe('720P');
  });

  it('buildVideoParams 默认 720P，可按面板切 1080P', () => {
    expect(buildVideoParams({ firstFrame: 'f.png', seconds: 6 }).size).toBe('720P');
    expect(buildVideoParams({ firstFrame: 'f.png', seconds: 6, size: '1080p' }).size).toBe('1080P');
    expect(buildVideoParams({ firstFrame: 'f.png', seconds: 6, size: 'bogus' }).size).toBe('720P');
  });
});

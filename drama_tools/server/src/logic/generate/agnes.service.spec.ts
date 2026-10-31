import { AgnesService } from './agnes.service';
import { AppConfig } from '../../config/configuration';
import { ConfigService } from '@nestjs/config';

/** UT-BE-08 AgnesService（fetch mock，无 key 优雅降级）。 */
describe('AgnesService (unit, fetch mocked)', () => {
  const base: AppConfig = {
    env: 'test',
    port: 8730,
    db: { type: 'sqlite', host: '', port: 0, username: '', password: '', database: '', sqliteFile: ':memory:' },
    agnes: {
      baseUrl: 'https://apihub.test',
      apiKey: 'sk-test',
      imageModel: 'agnes-image-2.5-flash',
      textModel: 'agnes-3.0-flash',
      videoModel: 'agnes-video-2.5-flash',
      videoApiPath: '/agnesapi',
      timeoutMs: 5000,
    },
    video: {
      pollIntervalMs: 10,
      pollTimeoutMs: 100,
      secondsMin: 4,
      secondsMax: 12,
      maxKeyframesPerEpisode: 20,
      ffmpegBin: 'ffmpeg',
    },
    queue: { concurrency: 1, videoConcurrency: 1, imageConcurrency: 1 },
    mediaDir: require('path').join(__dirname, '__media__'),
  };

  const makeService = (apiKey: string) =>
    new AgnesService({
      get: jest.fn(() => ({ ...base, agnes: { ...base.agnes, apiKey } })),
    } as unknown as ConfigService);

  beforeEach(() => jest.restoreAllMocks());

  describe('generateImage', () => {
    it('无 key → 优雅返回 AGNES_API_KEY missing', async () => {
      const r = await makeService('').generateImage('p', { ratio: '3:4' });
      expect(r.error).toContain('AGNES_API_KEY');
      expect(r.costMs).toBe(0);
    });

    it('200 + url → outUrl；响应体含 extra_body.image 与 response_format=url', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: [{ url: 'https://cdn/x.png' }] }),
      });
      const r = await makeService('sk-test').generateImage('p', { ratio: '3:4', refImages: ['a.png'] });
      expect(r.outUrl).toBe('https://cdn/x.png');
      const body = JSON.parse(((global as any).fetch.mock.calls[0][1].body as string));
      expect(body.extra_body.image).toEqual(['a.png']);
      expect(body.extra_body.response_format).toBe('url');
      expect(body.ratio).toBe('3:4');
      expect(body.response_format).toBeUndefined();
    });

    it('无参考图（文生图）→ 请求体必须省略 extra_body.image', async () => {
      // 回归：实测上游对 extra_body.image=[] 返回 400
      // "extra_body.image must not be empty"，导致所有文生图（资产基础形象）全部失败。
      (global as any).fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: [{ url: 'https://cdn/y.png' }] }),
      });
      await makeService('sk-test').generateImage('p', { ratio: '3:4', refImages: [] });
      const body = JSON.parse(((global as any).fetch.mock.calls[0][1].body as string));
      expect(body.extra_body).not.toHaveProperty('image');
      expect(body.extra_body.response_format).toBe('url');
    });

    it('HTTP 500 → error 不抛', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({ ok: false, status: 500, text: async () => 'boom' });
      const r = await makeService('sk-test').generateImage('p');
      expect(r.error).toContain('500');
    });
  });

  describe('generateText', () => {
    it('无 key → error', async () => {
      const r = await makeService('').generateText('prompt');
      expect(r.error).toContain('AGNES_API_KEY');
    });

    it('200 → 返回 content', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ choices: [{ message: { content: '{"episodes":[]}' } }] }),
      });
      const r = await makeService('sk-test').generateText('p', 'system');
      expect(r.content).toBe('{"episodes":[]}');
    });
  });

  describe('createVideoTask / pollVideoTask', () => {
    it('createVideoTask 返回 video_id', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ id: 'vid-123' }),
      });
      const r = await makeService('sk-test').createVideoTask({ mode: 'keyframe' });
      expect(r.videoId).toBe('vid-123');
    });

    it('pollVideoTask completed 返回 url', async () => {
      (global as any).fetch = jest.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ data: [{ status: 'completed', url: 'https://cdn/v.mp4' }] }),
      });
      const r = await makeService('sk-test').pollVideoTask('vid-123');
      expect(r.status).toBe('completed');
      expect(r.url).toBe('https://cdn/v.mp4');
    });

    it('pollVideoTask 网络错 → 保留 pending（不误判失败）', async () => {
      (global as any).fetch = jest.fn().mockRejectedValue(new Error('ECONNRESET'));
      const r = await makeService('sk-test').pollVideoTask('vid-123');
      expect(r.status).toBe('pending');
      expect(r.error).toContain('ECONNRESET');
    });
  });
});

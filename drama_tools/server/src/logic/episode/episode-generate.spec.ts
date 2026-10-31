import { EpisodeService } from './episode.service';

/**
 * UT-BE-12 分镜出图 / 视频生成参数透传：
 * 生成面板（「生成图片」「生成视频」抽屉）下发的 size / 风格 / 参考图
 * 必须真的进到 Agnes 调用参数里，否则 UI 上选了 2K、1080P 却全部按默认生成，
 * 用户看不出差别还多付了钱。
 */
describe('EpisodeService 生成参数透传', () => {
  const episode = { id: 1, project_id: 3, title: '第1集', seconds: 60 };
  const keyframe = {
    id: 7,
    episode_id: 1,
    seq: 1,
    seconds: 5,
    scene_setting: '90年代老街',
    shots: JSON.stringify([{ id: 's1', seconds: 5, visual: '两人并肩走过巷子', shot_size: '中景' }]),
    character_refs: JSON.stringify([11]),
    scene_refs: '[]',
    prop_refs: '[]',
    keyframe_url: 'https://cdn/first.png',
    shot_image_url: null,
    history: null,
  };

  const build = (agnesResult: any = { outUrl: 'https://cdn/new.png', costMs: 12 }) => {
    const episodeRepo = {
      findOne: jest.fn().mockResolvedValue(episode),
      update: jest.fn(),
    } as any;
    const keyframeRepo = {
      findOne: jest.fn().mockResolvedValue({ ...keyframe }),
      update: jest.fn(),
      find: jest.fn().mockResolvedValue([{ ...keyframe }]),
    } as any;
    const assetRepo = {
      find: jest.fn().mockResolvedValue([
        { id: 11, type: 'character', name: '吴明', base_image_url: 'https://cdn/char.png' },
      ]),
    } as any;
    const agnes = { generateImage: jest.fn().mockResolvedValue(agnesResult) };
    const bus = { publish: jest.fn(), finalize: jest.fn() };
    const videoQueue = { run: jest.fn().mockResolvedValue({ status: 'completed', url: 'https://cdn/v.mp4' }) };
    const taskRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue({ id: 99 }),
      create: jest.fn((x) => x),
      update: jest.fn(),
    } as any;
    const config = {
      get: jest.fn(() => ({
        queue: { imageConcurrency: 1, videoConcurrency: 1 },
        video: { maxKeyframesPerEpisode: 20, secondsMin: 4, secondsMax: 12 },
      })),
    };

    const svc = new EpisodeService(
      episodeRepo,
      keyframeRepo,
      { findOne: jest.fn().mockResolvedValue(null), update: jest.fn(), create: jest.fn((x) => x), save: jest.fn() } as any,
      taskRepo,
      assetRepo,
      {} as any,
      agnes as any,
      bus as any,
      videoQueue as any,
      {} as any,
      config as any,
    );
    return { svc, agnes, bus, videoQueue, keyframeRepo, taskRepo };
  };

  it('size=2K 真的传给 Agnes（默认值是 1K，不能静默忽略）', async () => {
    const { svc, agnes } = build();
    await svc.generateKeyframeImage(1, 7, 'keyframe', { size: '2K' });
    expect(agnes.generateImage).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ size: '2K' }),
    );
  });

  it('不带 size 时回落 1K', async () => {
    const { svc, agnes } = build();
    await svc.generateKeyframeImage(1, 7, 'keyframe', {});
    expect(agnes.generateImage).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ size: '1K' }),
    );
  });

  it('风格提示词追加进 prompt', async () => {
    const { svc, agnes } = build();
    await svc.generateKeyframeImage(1, 7, 'keyframe', { style_prompt: '90年代写实电影风格' });
    const prompt = agnes.generateImage.mock.calls[0][0] as string;
    expect(prompt).toContain('90年代写实电影风格');
  });

  it('面板勾选的参考图优先于按资产自动挑选', async () => {
    const { svc, agnes } = build();
    await svc.generateKeyframeImage(1, 7, 'keyframe', {
      ref_images: ['https://cdn/pick1.png', 'https://cdn/pick2.png'],
    });
    expect(agnes.generateImage).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ refImages: ['https://cdn/pick1.png', 'https://cdn/pick2.png'] }),
    );
  });

  it('没勾参考图时按片段角色引用自动挑选', async () => {
    const { svc, agnes } = build();
    await svc.generateKeyframeImage(1, 7, 'keyframe', {});
    expect(agnes.generateImage).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ refImages: ['https://cdn/char.png'] }),
    );
  });

  it('非法比例回落 16:9，不把脏值丢给上游', async () => {
    const { svc, agnes } = build();
    await svc.generateKeyframeImage(1, 7, 'keyframe', { ratio: '5:7' });
    expect(agnes.generateImage).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ ratio: '16:9' }),
    );
  });

  it('单镜头视频：1080p 折算成 1080P 传给视频队列', async () => {
    const { svc, videoQueue } = build();
    await svc.generateVideoForSegment(1, 7, { size: '1080p', ref_images: ['https://cdn/char.png'] });
    expect(videoQueue.run).toHaveBeenCalledWith(
      7,
      expect.objectContaining({ size: '1080p', images: ['https://cdn/char.png'] }),
      expect.any(Function),
    );
  });

  it('单镜头视频：未传时长时按片段时长并夹在 4~12s', async () => {
    const { svc, videoQueue } = build();
    await svc.generateVideoForSegment(1, 7, {});
    expect(videoQueue.run).toHaveBeenCalledWith(
      7,
      expect.objectContaining({ seconds: 5 }),
      expect.any(Function),
    );
  });
});
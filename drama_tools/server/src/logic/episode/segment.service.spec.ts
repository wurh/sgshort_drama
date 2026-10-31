import { EpisodeService } from './episode.service';
import type { Repository } from 'typeorm';
import { parseShots, stringifyShots, newShot } from './segments';

/**
 * 片段 / 分镜管理用例（详情页中栏交互的后端契约）：
 * - 老数据（无 shots 列）要能兜出分镜，否则详情页中栏是空卡片
 * - 增删改分镜后，片段时长必须与分镜之和对齐
 * - 片段至少保留一个分镜，避免空壳片段
 */
describe('EpisodeService 片段与分镜', () => {
  const episode = { id: 1, project_id: 3, title: '第1集', summary: 's', seconds: 90 };

  const build = (seed: any[]) => {
    const store = seed.map((r) => ({ ...r }));
    const keyframeRepo = {
      find: jest.fn(async ({ where }: any) =>
        store
          .filter((r) => r.episode_id === where.episode_id)
          .sort((a, b) => a.seq - b.seq),
      ),
      findOne: jest.fn(async ({ where }: any) =>
        store.find(
          (r) =>
            r.id === where.id &&
            (where.episode_id === undefined || r.episode_id === where.episode_id),
        ) ?? null,
      ),
      update: jest.fn(async (id: number, patch: any) => {
        const row = store.find((r) => r.id === id);
        if (row) Object.assign(row, patch);
      }),
      save: jest.fn(async (x: any) => {
        const row = { id: store.length + 1, ...x };
        store.push(row);
        return row;
      }),
      create: jest.fn((x: any) => x),
      delete: jest.fn(),
      remove: jest.fn(async (x: any) => {
        const i = store.findIndex((r) => r.id === x.id);
        if (i >= 0) store.splice(i, 1);
      }),
    } as unknown as Repository<any>;

    const episodeRepo = {
      findOne: jest.fn().mockResolvedValue(episode),
      find: jest.fn().mockResolvedValue([episode]),
      update: jest.fn(),
      save: jest.fn(),
      create: jest.fn((x: any) => x),
      remove: jest.fn(),
    } as unknown as Repository<any>;
    const videoRepo = {
      findOne: jest.fn().mockResolvedValue(null),
      delete: jest.fn(),
    } as unknown as Repository<any>;

    const svc = new EpisodeService(
      episodeRepo as any,
      keyframeRepo as any,
      videoRepo as any,
      {} as any,
      { find: jest.fn().mockResolvedValue([]) } as any,
      { findOne: jest.fn().mockResolvedValue({ id: 3 }) } as any,
      {} as any,
      { publish: jest.fn(), finalize: jest.fn() } as any,
      {} as any,
      {} as any,
      { get: jest.fn(() => ({ queue: { imageConcurrency: 1 }, video: { maxKeyframesPerEpisode: 20 } })) } as any,
    );
    return { svc, store, keyframeRepo };
  };

  const row = (partial: any = {}) => ({
    id: 1,
    episode_id: 1,
    seq: 1,
    shot_type: '中景',
    camera: '固定',
    seconds: 8,
    visual_desc: '老数据画面',
    dialogue: '老数据台词',
    keyframe_url: null,
    shot_image_url: null,
    history: null,
    shots: null,
    video_status: 'pending',
    ...partial,
  });

  it('老数据（shots 为空）兜出一个稳定 id 的分镜', async () => {
    const { svc } = build([row({ id: 5, shots: null })]);
    const list = await svc.listKeyframes(1);
    expect(list).toHaveLength(1);
    expect(list[0].shots).toHaveLength(1);
    expect(list[0].shots[0].id).toBe('seg-5-shot-1');
    expect(list[0].shots[0].visual).toBe('老数据画面');

    // 二次读取 id 必须一致（否则前端编辑永远命中不了）
    const again = await svc.listKeyframes(1);
    expect(again[0].shots[0].id).toBe('seg-5-shot-1');
  });

  it('新增分镜后片段时长 = 分镜之和', async () => {
    const { svc, store } = build([
      row({ id: 1, shots: stringifyShots([newShot({ id: 's1', seconds: 4 })]) }),
    ]);
    await svc.addShot(1, 1, { shot: { seconds: 6, visual: '新分镜' } });
    const list = parseShots(store[0].shots);
    expect(list).toHaveLength(2);
    expect(store[0].seconds).toBe(10);
  });

  it('编辑分镜只影响目标分镜', async () => {
    const { svc, store } = build([
      row({
        id: 1,
        shots: stringifyShots([
          newShot({ id: 's1', visual: 'a', seconds: 3 }),
          newShot({ id: 's2', visual: 'b', seconds: 5 }),
        ]),
      }),
    ]);
    const v = await svc.editShot(1, 1, 's2', { visual: '改后' });
    const list = parseShots(store[0].shots);
    expect(list.find((s) => s.id === 's1')!.visual).toBe('a');
    expect(list.find((s) => s.id === 's2')!.visual).toBe('改后');
    expect(v.shot_count).toBe(2);
    expect(v.seconds).toBe(8);
  });

  it('编辑不存在的分镜 → 404（不静默成功）', async () => {
    const { svc } = build([row({ id: 1, shots: stringifyShots([newShot({ id: 's1' })]) })]);
    await expect(svc.editShot(1, 1, 'nope', { visual: 'x' })).rejects.toThrow(/not found/);
  });

  it('删除最后一个分镜被拒绝（片段不能空壳）', async () => {
    const { svc } = build([row({ id: 1, shots: stringifyShots([newShot({ id: 's1' })]) })]);
    await expect(svc.removeShot(1, 1, 's1')).rejects.toMatchObject({ httpStatus: 400 });
  });

  it('删除分镜后时长同步减少', async () => {
    const { svc, store } = build([
      row({
        id: 1,
        shots: stringifyShots([
          newShot({ id: 's1', seconds: 3 }),
          newShot({ id: 's2', seconds: 7 }),
        ]),
      }),
    ]);
    await svc.removeShot(1, 1, 's1');
    expect(parseShots(store[0].shots)).toHaveLength(1);
    expect(store[0].seconds).toBe(7);
  });

  it('重排片段：按给定 id 顺序归一 seq 为 1..N', async () => {
    const { svc, store } = build([
      row({ id: 1, seq: 1, shots: stringifyShots([newShot({ id: 'a' })]) }),
      row({ id: 2, seq: 2, shots: stringifyShots([newShot({ id: 'b' })]) }),
      row({ id: 3, seq: 3, shots: stringifyShots([newShot({ id: 'c' })]) }),
    ]);
    await svc.reorderSegments(1, { keyframe_ids: [3, 1, 2] });
    const order = [...store].sort((a, b) => a.seq - b.seq).map((r) => r.id);
    expect(order).toEqual([3, 1, 2]);
    expect([...store].sort((a, b) => a.seq - b.seq).map((r) => r.seq)).toEqual([1, 2, 3]);
  });

  it('重排时漏传的片段补到末尾，不丢数据', async () => {
    const { svc, store } = build([
      row({ id: 1, seq: 1, shots: stringifyShots([newShot({ id: 'a' })]) }),
      row({ id: 2, seq: 2, shots: stringifyShots([newShot({ id: 'b' })]) }),
    ]);
    await svc.reorderSegments(1, { keyframe_ids: [2] });
    expect(store).toHaveLength(2);
    expect([...store].sort((a, b) => a.seq - b.seq).map((r) => r.id)).toEqual([2, 1]);
  });

  it('删除片段后剩余片段 seq 连续（不留断号）', async () => {
    const { svc, store } = build([
      row({ id: 1, seq: 1, shots: stringifyShots([newShot({ id: 'a' })]) }),
      row({ id: 2, seq: 2, shots: stringifyShots([newShot({ id: 'b' })]) }),
      row({ id: 3, seq: 3, shots: stringifyShots([newShot({ id: 'c' })]) }),
    ]);
    await svc.removeKeyframe(1, 2);
    expect([...store].sort((a, b) => a.seq - b.seq).map((r) => r.seq)).toEqual([1, 2]);
  });

  it('片段级编辑：场景设定与覆盖分镜同时生效', async () => {
    const { svc, store } = build([row({ id: 1, shots: stringifyShots([newShot({ id: 's1' })]) })]);
    const v = await svc.editSegment(1, 1, {
      scene_setting: '90年代老街',
      shots: [{ id: 's1', seconds: 6, visual: '夜景' }],
    });
    expect(store[0].scene_setting).toBe('90年代老街');
    expect(v.seconds).toBe(6);
    expect(v.shots[0].visual).toBe('夜景');
  });

  it('卡片统计：shot_count 含分镜数，封面取首个已出图片段', async () => {
    const { svc } = build([
      row({
        id: 1,
        seq: 1,
        keyframe_url: null,
        shots: stringifyShots([newShot({ id: 'a', seconds: 3 }), newShot({ id: 'b', seconds: 4 })]),
      }),
      row({
        id: 2,
        seq: 2,
        keyframe_url: 'https://cdn/k2.png',
        shots: stringifyShots([newShot({ id: 'c', seconds: 5 })]),
      }),
    ]);
    const [stat] = await svc.listWithStats(3);
    expect(stat.keyframe_count).toBe(2);
    expect(stat.shot_count).toBe(3);
    expect(stat.total_seconds).toBe(12);
    expect(stat.cover_url).toBe('https://cdn/k2.png');
    expect(stat.image_done).toBe(1);
  });
});
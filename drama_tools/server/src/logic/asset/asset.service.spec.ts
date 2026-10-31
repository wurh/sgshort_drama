import { AssetService } from './asset.service';
import { stableBaseVariantId } from './variants';
import type { Repository } from 'typeorm';

/**
 * UT-BE-12 资产状态机（回归）：
 * 用户报告「资产库一直 loading、看不到生图」，根因两条：
 *  1) 大纲播种的资产草稿直接写成 status='generating'，而没有任何任务在跑 → 前端永久 loading；
 *  2) 生成失败/服务重启后卡在 generating 无人收尾。
 * 断言：草稿初始应为 pending；超时僵尸态在列表时自愈。
 */
describe('AssetService 资产状态机', () => {
  const makeRow = (over: Record<string, any> = {}) => ({
    id: 1,
    project_id: 3,
    type: 'character',
    name: '林远',
    desc: null,
    base_image_url: null,
    extra_images: null,
    status: 'pending',
    sync_enabled: true,
    auto_sync: false,
    cost_ms: null,
    error: null,
    created_at: new Date(),
    updated_at: new Date(),
    ...over,
  });

  const build = (rows: any[], agnesResult?: Record<string, any>) => {
    const repo = {
      find: jest.fn().mockResolvedValue(rows),
      findOne: jest.fn().mockResolvedValue(rows[0] ?? null),
      create: jest.fn((x) => x),
      save: jest.fn((x) => ({ id: 9, ...x })),
      // update 同步回写到内存行，模拟真实持久化后再 findOne 能读到新状态
      update: jest.fn((id: number, patch: Record<string, any>) => {
        const row = rows.find((r) => r.id === id) ?? rows[0];
        if (row) Object.assign(row, patch);
        return Promise.resolve({});
      }),
      remove: jest.fn(),
    } as unknown as Repository<any>;
    const projectRepo = { findOne: jest.fn().mockResolvedValue({ id: 3, style: '都市' }) } as unknown as Repository<any>;
    const agnes = {
      generateImage: jest
        .fn()
        .mockResolvedValue(agnesResult ?? { outUrl: 'https://cdn/x.png', costMs: 12 }),
      imageModelName: jest.fn(() => 'agnes-image-2.5-flash'),
    };
    const bus = { publish: jest.fn() };
    const svc = new AssetService(repo as any, projectRepo as any, agnes as any, bus as any);
    return { svc, repo, agnes, bus };
  };

  it('create 新建资产初始 status=pending（不是 generating）', async () => {
    const { svc, repo } = build([makeRow()]);
    const v = await svc.create(3, { type: 'character', name: '林远' });
    expect(v.status).toBe('pending');
    expect((repo.save as jest.Mock).mock.calls[0][0].status).toBe('pending');
  });

  it('list 自愈：超时仍 generating 且无图 → 重置 pending', async () => {
    const stale = makeRow({
      status: 'generating',
      updated_at: new Date(Date.now() - 60 * 60 * 1000),
    });
    const { svc, repo } = build([stale]);
    const list = await svc.list(3);
    expect(list[0].status).toBe('pending');
    expect(repo.update).toHaveBeenCalledWith(1, { status: 'pending', error: null });
  });

  it('list 不自愈：刚刚进入 generating 的资产保持原状', async () => {
    const fresh = makeRow({ status: 'generating', updated_at: new Date() });
    const { svc, repo } = build([fresh]);
    const list = await svc.list(3);
    expect(list[0].status).toBe('generating');
    // 只可能有 variants 归一化落库，不应有 status 重置
    expect(repo.update).not.toHaveBeenCalledWith(1, { status: 'pending', error: null });
  });

  /**
   * 回归：老资产 variants 列为 NULL 时，读详情每次都会现场合成基础形象。
   * 若合成出的 id 随机，前端拿到的 id 与写操作重新合成的 id 永远对不上，
   * 表现为详情页「点保存 / 切风格就报 variant xxx not found」。
   */
  it('getOne：老数据（variants=null）首次读取即落库，且 id 稳定可复用', async () => {
    const legacy = makeRow({ variants: null, base_image_url: 'https://cdn/a.png' });
    const { svc, repo } = build([legacy]);
    const first = await svc.getOne(3, 1);
    const id = first.variants[0].id;
    expect(id).toBe(stableBaseVariantId(1));
    // 首次读取要把归一化结果写回，之后不再现场合成
    expect(repo.update).toHaveBeenCalledWith(1, {
      variants: expect.stringContaining(id),
    });

    const second = await svc.getOne(3, 1);
    expect(second.variants[0].id).toBe(id);
  });

  it('updateVariant：用 getOne 返回的 id 能命中老数据的基础形象', async () => {
    const legacy = makeRow({ variants: null, base_image_url: 'https://cdn/a.png' });
    const { svc } = build([legacy]);
    const detail = await svc.getOne(3, 1);
    const vid = detail.variants[0].id;
    const updated = await svc.updateVariant(3, 1, vid, { name: '旧校服' });
    expect(updated.variants.find((v) => v.id === vid)?.name).toBe('旧校服');
  });

  it('generateBase 成功 → done + base_image_url，并先置 generating', async () => {
    const { svc, repo, agnes } = build([makeRow()]);
    const v = await svc.generateBase(3, 1);
    expect(agnes.generateImage).toHaveBeenCalled();
    // 无参考图时不能传空 refImages 数组给上层（上层会省略字段）
    expect(repo.update).toHaveBeenCalledWith(1, expect.objectContaining({ status: 'generating' }));
    expect(repo.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ status: 'done', base_image_url: 'https://cdn/x.png' }),
    );
    expect(v.status).toBe('done');
    expect(v.base_image_url).toBe('https://cdn/x.png');
  });

  it('generateBase 失败 → failed + error 落库并推事件', async () => {
    const { svc, repo, bus } = build([makeRow()], {
      costMs: 3,
      error: 'agnes image 400: extra_body.image must not be empty',
    });
    await svc.generateBase(3, 1);
    expect(repo.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ status: 'failed' }),
    );
    expect(bus.publish).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('失败') }),
    );
  });

  it('addImage 传 url → 直接追加，不调生成', async () => {
    const row = makeRow({ extra_images: JSON.stringify(['https://cdn/a.png']) });
    const { svc, agnes, repo } = build([row]);
    await svc.addImage(3, 1, 'https://cdn/b.png');
    expect(agnes.generateImage).not.toHaveBeenCalled();
    const saved = (repo.update as jest.Mock).mock.calls.at(-1)[1].extra_images;
    expect(JSON.parse(saved)).toEqual(['https://cdn/a.png', 'https://cdn/b.png']);
  });

  it('addImage 不传 url → 真的去生成一张多视图（旧实现是空操作）', async () => {
    const row = makeRow({ base_image_url: 'https://cdn/base.png' });
    const { svc, agnes, repo } = build([row]);
    await svc.addImage(3, 1);
    expect(agnes.generateImage).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ refImages: ['https://cdn/base.png'] }),
    );
    const saved = (repo.update as jest.Mock).mock.calls.at(-1)[1].extra_images;
    expect(JSON.parse(saved)).toEqual(['https://cdn/x.png']);
  });

  it('batchGenerateBase 只处理无基础形象的资产', async () => {
    const noImg = makeRow({ id: 1 });
    const hasImg = makeRow({ id: 2, base_image_url: 'https://cdn/base.png', status: 'done' });
    const { svc, agnes } = build([noImg, hasImg]);
    const r = await svc.batchGenerateBase(3);
    expect(r.total).toBe(1);
    // 只对 id=1 调过一次生成
    expect(agnes.generateImage).toHaveBeenCalledTimes(1);
  });
});
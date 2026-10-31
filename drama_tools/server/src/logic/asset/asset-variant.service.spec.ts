import { AssetService } from './asset.service';
import { parseVariants, stringifyVariants, newVariant } from './variants';
import type { Repository } from 'typeorm';

/**
 * UT-BE-15 形象（variant）业务：详情页三栏页面的后端支撑。
 * 覆盖：创建/改名/删除（基础形象保护）/生成立绘与四视图/图组追加/老数据兜底。
 */
describe('AssetService 形象管理', () => {
  const makeRow = (over: Record<string, any> = {}) => ({
    id: 1,
    project_id: 3,
    type: 'character',
    name: '李富贵',
    desc: '十七岁中国男性',
    base_image_url: null,
    extra_images: null,
    variants: null,
    status: 'done',
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
      update: jest.fn((id: number, patch: Record<string, any>) => {
        const row = rows.find((r) => r.id === id) ?? rows[0];
        if (row) Object.assign(row, patch);
        return Promise.resolve({});
      }),
      remove: jest.fn(),
    } as unknown as Repository<any>;
    const projectRepo = {
      findOne: jest.fn().mockResolvedValue({ id: 3, style: '都市' }),
    } as unknown as Repository<any>;
    const agnes = {
      generateImage: jest
        .fn()
        .mockResolvedValue(agnesResult ?? { outUrl: 'https://cdn/gen.png', costMs: 20 }),
      imageModelName: jest.fn(() => 'agnes-image-2.5-flash'),
    };
    const bus = { publish: jest.fn() };
    const svc = new AssetService(repo as any, projectRepo as any, agnes as any, bus as any);
    return { svc, repo, agnes, bus };
  };

  const withBase = (name = '李富贵') =>
    makeRow({
      name,
      base_image_url: 'https://cdn/base.png',
      variants: stringifyVariants([
        newVariant({
          name: '基础形象',
          kind: 'base',
          portrait_url: 'https://cdn/base.png',
          status: 'done',
        }),
      ]),
    });

  it('create 会预制一个「基础形象」形象（详情页 tab 有内容）', async () => {
    const { svc, repo } = build([makeRow()]);
    const v = await svc.create(3, { type: 'character', name: '李富贵' });
    expect(v.variants.length).toBe(1);
    expect(v.variants[0].kind).toBe('base');
    const saved = (repo.save as jest.Mock).mock.calls[0][0];
    expect(parseVariants(saved.variants).length).toBe(1);
    expect(v.variant_names).toEqual(['基础形象']);
  });

  it('create 支持传风格 key', async () => {
    const { svc } = build([makeRow()]);
    const v = await svc.create(3, { type: 'character', name: 'X', style_key: 'real-film' });
    expect(v.variants[0].style_key).toBe('real-film');
  });

  it('create 传非法风格 key 时忽略（不写脏值）', async () => {
    const { svc } = build([makeRow()]);
    const v = await svc.create(3, { type: 'character', name: 'X', style_key: 'bogus' });
    expect(v.variants[0].style_key).toBeNull();
  });

  it('getOne 老数据（只有 base_image_url）兜出基础形象且状态 done', async () => {
    const row = makeRow({ base_image_url: 'https://cdn/old.png', variants: null });
    const { svc } = build([row]);
    const v = await svc.getOne(3, 1);
    expect(v.variants.length).toBe(1);
    expect(v.variants[0].portrait_url).toBe('https://cdn/old.png');
    expect(v.variants[0].status).toBe('done');
  });

  it('getOne 老数据把 extra_images 补进图组（「已添加形象 n/m」不能显示 0）', async () => {
    const row = makeRow({
      base_image_url: 'https://cdn/a.png',
      extra_images: JSON.stringify(['https://cdn/b.png', 'https://cdn/c.png']),
      variants: null,
    });
    const { svc } = build([row]);
    const v = await svc.getOne(3, 1);
    expect(v.variants[0].gallery).toEqual(['https://cdn/b.png', 'https://cdn/c.png']);
  });

  it('createVariant 追加一个新形象，默认名递增', async () => {
    const { svc } = build([withBase()]);
    const v = await svc.createVariant(3, 1, { name: '旧校服' });
    expect(v.variants.length).toBe(2);
    expect(v.variants[1].name).toBe('旧校服');
    expect(v.variants[1].kind).toBe('custom');
    expect(v.variants[1].status).toBe('pending');
  });

  it('createVariant 不传名时给默认名「新形象N」', async () => {
    const { svc } = build([withBase()]);
    const v = await svc.createVariant(3, 1, {});
    expect(v.variants[1].name).toBe('新形象1');
  });

  it('updateVariant 改名/改描述/勾选应用到所有形象', async () => {
    const row = withBase();
    const vid = parseVariants(row.variants)[0].id;
    const { svc } = build([row]);
    const v = await svc.updateVariant(3, 1, vid, {
      name: ' 少年 ',
      desc: '旧校服版本',
      apply_to_all: true,
    });
    const target = v.variants.find((x) => x.id === vid)!;
    expect(target.name).toBe('少年'); // 首尾空格被裁掉
    expect(target.desc).toBe('旧校服版本');
    expect(target.apply_to_all).toBe(true);
    // 资产名不受影响（避免改形象名把资产名一起改掉）
    expect(v.name).toBe('李富贵');
  });

  it('updateVariant 空名字被忽略，不会把名字清空', async () => {
    const row = withBase();
    const vid = parseVariants(row.variants)[0].id;
    const { svc } = build([row]);
    const v = await svc.updateVariant(3, 1, vid, { name: '   ' });
    expect(v.variants[0].name).toBe('基础形象');
  });

  it('updateVariant 目标不存在 → 404', async () => {
    const { svc } = build([withBase()]);
    await expect(svc.updateVariant(3, 1, 'nope', { name: 'x' })).rejects.toThrow(
      /variant nope not found/,
    );
  });

  it('deleteVariant 拒绝删除基础形象', async () => {
    const row = withBase();
    const vid = parseVariants(row.variants)[0].id;
    const { svc } = build([row]);
    await expect(svc.deleteVariant(3, 1, vid)).rejects.toThrow(/基础形象不可删除/);
  });

  it('deleteVariant 删除自定义形象成功', async () => {
    const base = newVariant({ name: '基础形象', kind: 'base' });
    const custom = newVariant({ name: '旧校服' });
    const row = makeRow({ variants: stringifyVariants([base, custom]) });
    const { svc } = build([row]);
    const v = await svc.deleteVariant(3, 1, custom.id);
    expect(v.variants.length).toBe(1);
    expect(v.variants[0].kind).toBe('base');
  });

  it('generateVariantImage portrait：写入 portrait_url 并同步 base_image_url', async () => {
    const row = withBase();
    const vid = parseVariants(row.variants)[0].id;
    const { svc, agnes } = build([row]);
    const v = await svc.generateVariantImage(3, 1, vid, 'portrait');
    expect(agnes.generateImage).toHaveBeenCalledWith(
      expect.stringContaining('角色：李富贵'),
      expect.objectContaining({ ratio: '3:4' }),
    );
    expect(v.variants[0].portrait_url).toBe('https://cdn/gen.png');
    expect(v.base_image_url).toBe('https://cdn/gen.png');
    expect(v.status).toBe('done');
  });

  /**
   * 回归：用户报告「这些生成完了，为什么还是没有形象？」。
   * 卡片上的「已添加形象 n/4」读的是 gallery，之前生成只写 portrait/sheet，
   * 于是图有了、图组还是 0，界面看起来就像没生成出形象。
   */
  it('generateVariantImage portrait：生成的图自动进图组（不再是 0/4）', async () => {
    const row = withBase();
    const vid = parseVariants(row.variants)[0].id;
    const { svc } = build([row]);
    const v = await svc.generateVariantImage(3, 1, vid, 'portrait');
    expect(v.variants[0].gallery).toContain('https://cdn/gen.png');
    expect(v.variants[0].gallery.length).toBeGreaterThan(0);
  });

  it('generateVariantImage sheet：四视图也进图组，立绘仍在组内', async () => {
    const row = makeRow({
      base_image_url: 'https://cdn/base.png',
      variants: stringifyVariants([
        newVariant({
          name: '基础形象',
          kind: 'base',
          portrait_url: 'https://cdn/base.png',
          status: 'done',
        }),
      ]),
    });
    const vid = parseVariants(row.variants)[0].id;
    const { svc } = build([row]);
    const v = await svc.generateVariantImage(3, 1, vid, 'sheet');
    expect(v.variants[0].gallery).toEqual(['https://cdn/base.png', 'https://cdn/gen.png']);
  });

  it('generateBase：基础形象生成的图同样自动进图组', async () => {
    const row = makeRow();
    const { svc } = build([row]);
    const v = await svc.generateBase(3, 1);
    expect(v.variants[0].gallery).toEqual(['https://cdn/gen.png']);
  });

  it('getOne：有立绘但图组为空的老数据，读取时自动补齐并落库', async () => {
    const row = makeRow({
      base_image_url: 'https://cdn/a.png',
      variants: stringifyVariants([
        newVariant({
          name: '基础形象',
          kind: 'base',
          portrait_url: 'https://cdn/a.png',
          status: 'done',
        }),
      ]),
    });
    const { svc, repo } = build([row]);
    const v = await svc.getOne(3, 1);
    expect(v.variants[0].gallery).toEqual(['https://cdn/a.png']);
    expect(repo.update).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ variants: expect.stringContaining('https://cdn/a.png') }),
    );
  });

  it('generateVariantImage sheet：16:9，以立绘为参考图保证一致', async () => {
    const row = withBase();
    const vid = parseVariants(row.variants)[0].id;
    const { svc, agnes } = build([row]);
    const v = await svc.generateVariantImage(3, 1, vid, 'sheet');
    const call = (agnes.generateImage as jest.Mock).mock.calls.at(-1);
    expect(call[1].ratio).toBe('16:9');
    expect(call[1].refImages).toEqual(['https://cdn/base.png']);
    // 四视图只写 sheet_url，不动 portrait
    expect(v.variants[0].sheet_url).toBe('https://cdn/gen.png');
    expect(v.variants[0].portrait_url).toBe('https://cdn/base.png');
  });

  it('generateVariantImage 失败：保留已有立绘，不改 base_image_url', async () => {
    const row = withBase();
    const vid = parseVariants(row.variants)[0].id;
    const { svc } = build([row], { costMs: 3, error: 'agnes image 429' });
    const v = await svc.generateVariantImage(3, 1, vid, 'portrait');
    expect(v.base_image_url).toBe('https://cdn/base.png');
    expect(v.variants[0].error).toContain('429');
    // 已有图 → 状态回 done（不是 failed），避免整卡变红
    expect(v.variants[0].status).toBe('done');
  });

  /**
   * 场景/道具页有比例控件（16:9 / 1:1 / 3:4）。
   * 之前接口写死按类型给比例，控件再怎么点都没用。
   */
  it('generateVariantImage 支持场景比例覆盖（1:1）', async () => {
    const row = makeRow({
      type: 'scene',
      base_image_url: 'https://cdn/s.png',
      variants: stringifyVariants([
        newVariant({ kind: 'base', portrait_url: 'https://cdn/s.png', status: 'done' }),
      ]),
    });
    const vid = parseVariants(row.variants)[0].id;
    const { svc, agnes } = build([row]);
    await svc.generateVariantImage(3, 1, vid, 'portrait', '1:1');
    expect(agnes.generateImage).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ ratio: '1:1' }),
    );
  });

  it('generateVariantImage 比例非法时回落到类型默认值（场景 16:9）', async () => {
    const row = makeRow({
      type: 'scene',
      base_image_url: 'https://cdn/s.png',
      variants: stringifyVariants([
        newVariant({ kind: 'base', portrait_url: 'https://cdn/s.png', status: 'done' }),
      ]),
    });
    const vid = parseVariants(row.variants)[0].id;
    const { svc, agnes } = build([row]);
    await svc.generateVariantImage(3, 1, vid, 'portrait', 'bogus');
    expect(agnes.generateImage).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ ratio: '16:9' }),
    );
  });

  it('场景/道具生成 sheet（四视图）→ 400，不做无意义的付费生图', async () => {
    const row = makeRow({
      type: 'scene',
      variants: stringifyVariants([newVariant({ kind: 'base' })]),
    });
    const vid = parseVariants(row.variants)[0].id;
    const { svc, agnes } = build([row]);
    await expect(svc.generateVariantImage(3, 1, vid, 'sheet')).rejects.toThrow(
      /不支持四视图/,
    );
    expect(agnes.generateImage).not.toHaveBeenCalled();
  });

  it('addVariantGallery 追加图片，超过 4 张丢最旧', async () => {
    const row = withBase();
    const vid = parseVariants(row.variants)[0].id;
    const { svc } = build([row]);
    for (const u of ['1', '2', '3', '4', '5']) {
      await svc.addVariantGallery(3, 1, vid, `https://cdn/${u}.png`);
    }
    const v = await svc.getOne(3, 1);
    expect(v.variants[0].gallery).toEqual([
      'https://cdn/2.png',
      'https://cdn/3.png',
      'https://cdn/4.png',
      'https://cdn/5.png',
    ]);
  });

  it('addVariantGallery 缺 url → 400', async () => {
    const row = withBase();
    const vid = parseVariants(row.variants)[0].id;
    const { svc } = build([row]);
    await expect(svc.addVariantGallery(3, 1, vid, '')).rejects.toThrow(/url required/);
  });

  it('setProjectSync 批量开/关整个项目的同步开关', async () => {
    const rows = [makeRow({ id: 1 }), makeRow({ id: 2 })];
    const { svc, repo } = build(rows);
    const r = await svc.setProjectSync(3, { sync_enabled: false, auto_sync: true });
    expect(r.updated).toBe(2);
    expect(repo.update).toHaveBeenCalledWith(1, { sync_enabled: false, auto_sync: true });
    expect(repo.update).toHaveBeenCalledWith(2, { sync_enabled: false, auto_sync: true });
  });

  it('setProjectSync 空 payload 不做任何写操作', async () => {
    const { svc, repo } = build([makeRow()]);
    const r = await svc.setProjectSync(3, {});
    expect(r.updated).toBe(0);
    expect(repo.update).not.toHaveBeenCalled();
  });
});
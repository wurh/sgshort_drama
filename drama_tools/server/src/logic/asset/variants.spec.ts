import {
  MAX_GALLERY,
  backfillGallery,
  collectImage,
  ensureBaseVariant,
  galleryStat,
  needsGalleryBackfill,
  newVariant,
  parseVariants,
  patchVariant,
  pushGallery,
  removeVariant,
  sanitizeVariantForType,
  stableBaseVariantId,
  stringifyVariants,
} from './variants';

/** UT-BE-13 形象（variant）领域纯函数。 */
describe('variants 领域函数', () => {
  it('parseVariants 容错：null / 非 JSON / 非数组 / 缺 id 都返回 []', () => {
    expect(parseVariants(null)).toEqual([]);
    expect(parseVariants('')).toEqual([]);
    expect(parseVariants('not-json')).toEqual([]);
    expect(parseVariants('{"a":1}')).toEqual([]);
    expect(parseVariants('[{"name":"x"}]')).toEqual([]); // 缺 id 被过滤
  });

  it('parseVariants 正常解析数组', () => {
    const v = newVariant({ name: '基础形象', kind: 'base' });
    const back = parseVariants(stringifyVariants([v]));
    expect(back.length).toBe(1);
    expect(back[0].id).toBe(v.id);
    expect(back[0].name).toBe('基础形象');
  });

  it('newVariant 生成稳定默认值', () => {
    const v = newVariant();
    expect(v.id).toBeTruthy();
    expect(v.kind).toBe('custom');
    expect(v.status).toBe('pending');
    expect(v.gallery).toEqual([]);
    expect(v.created_at).toBeGreaterThan(0);
  });

  it('ensureBaseVariant：老数据只有 base_image_url 时兜出基础形象', () => {
    const list = ensureBaseVariant([], 'https://cdn/a.png', 'agnes-image-2.5-flash');
    expect(list.length).toBe(1);
    expect(list[0].kind).toBe('base');
    expect(list[0].portrait_url).toBe('https://cdn/a.png');
    expect(list[0].status).toBe('done');
  });

  it('ensureBaseVariant：完全没有图时也给一个 pending 的基础形象', () => {
    const list = ensureBaseVariant([], null);
    expect(list.length).toBe(1);
    expect(list[0].status).toBe('pending');
    expect(list[0].portrait_url).toBeNull();
  });

  it('ensureBaseVariant：已有形象列表时原样返回（幂等）', () => {
    const exists = [newVariant({ name: '旧校服' })];
    expect(ensureBaseVariant(exists, 'https://cdn/a.png')).toBe(exists);
  });

  /**
   * 回归：老资产 variants 列为 NULL 时，兜底的基础形象 id 必须稳定。
   * 曾经用 randomUUID()，导致「GET 拿到的 id」与「POST 时重新合成的 id」对不上，
   * 前端一保存/切风格就报 variant xxx not found。
   */
  it('ensureBaseVariant：同一 assetId 多次归一化产出相同 id', () => {
    const a = ensureBaseVariant([], 'https://cdn/a.png', null, 3);
    const b = ensureBaseVariant([], 'https://cdn/a.png', null, 3);
    expect(a[0].id).toBe(b[0].id);
    expect(a[0].id).toBe(stableBaseVariantId(3));
  });

  it('ensureBaseVariant：不同 assetId 的基础形象 id 不同', () => {
    expect(stableBaseVariantId(3)).not.toBe(stableBaseVariantId(4));
  });

  it('ensureBaseVariant：有 base 图时 status=done，无图时 pending', () => {
    expect(ensureBaseVariant([], 'https://cdn/a.png', null, 1)[0].status).toBe('done');
    expect(ensureBaseVariant([], null, null, 1)[0].status).toBe('pending');
  });

  it('pushGallery 超过上限时丢最旧（对齐「已添加形象 4/4」）', () => {
    let v = newVariant();
    v = pushGallery(v, ['1', '2', '3', '4']);
    expect(v.gallery.length).toBe(MAX_GALLERY);
    v = pushGallery(v, ['5']);
    expect(v.gallery).toEqual(['2', '3', '4', '5']);
  });

  it('pushGallery 过滤空值', () => {
    const v = pushGallery(newVariant(), ['', 'a.png', undefined as unknown as string]);
    expect(v.gallery).toEqual(['a.png']);
  });

  it('patchVariant 只改目标形象，id 不可被覆盖', () => {
    const a = newVariant({ name: 'A' });
    const b = newVariant({ name: 'B' });
    const { list, updated } = patchVariant([a, b], a.id, {
      name: '改名',
      id: 'hacked',
    } as never);
    expect(updated?.name).toBe('改名');
    expect(updated?.id).toBe(a.id);
    expect(list[1]).toBe(b);
  });

  it('patchVariant 找不到目标返回 null', () => {
    const { updated } = patchVariant([newVariant()], 'nope', { name: 'x' });
    expect(updated).toBeNull();
  });

  it('removeVariant 允许删除自定义形象', () => {
    const base = newVariant({ kind: 'base' });
    const custom = newVariant({ name: '旧校服' });
    const { list, removed } = removeVariant([base, custom], custom.id);
    expect(removed).toBe(true);
    expect(list.length).toBe(1);
  });

  it('removeVariant 拒绝删除基础形象', () => {
    const base = newVariant({ kind: 'base' });
    const { list, removed } = removeVariant([base], base.id);
    expect(removed).toBe(false);
    expect(list.length).toBe(1);
  });

  it('galleryStat 口径与上限一致', () => {
    const v = pushGallery(newVariant(), ['a', 'b']);
    expect(galleryStat(v)).toEqual({ used: 2, max: MAX_GALLERY });
  });

  /**
   * 回归：用户报告「图都生成完了，卡片还是显示没有形象（0/4 + 一排空框）」。
   * 根因是生成的图只写进 portrait/sheet，从没写进 gallery。
   */
  describe('图组兜底（生成完必须有形象）', () => {
    it('backfillGallery：图组空时用「立绘 → 四视图」补齐', () => {
      const v = backfillGallery(
        newVariant({
          portrait_url: 'https://cdn/p.png',
          sheet_url: 'https://cdn/s.png',
        }),
      );
      expect(v.gallery).toEqual(['https://cdn/p.png', 'https://cdn/s.png']);
    });

    it('backfillGallery：只有立绘也能补 1 张', () => {
      const v = backfillGallery(newVariant({ portrait_url: 'https://cdn/p.png' }));
      expect(v.gallery).toEqual(['https://cdn/p.png']);
    });

    it('backfillGallery：图组已有内容时原样保留（不打乱用户顺序）', () => {
      const v = backfillGallery(
        newVariant({ portrait_url: 'https://cdn/p.png', gallery: ['https://cdn/x.png'] }),
      );
      expect(v.gallery).toEqual(['https://cdn/x.png']);
    });

    it('backfillGallery：一张图都没有时保持空', () => {
      expect(backfillGallery(newVariant()).gallery).toEqual([]);
    });

    it('needsGalleryBackfill：识别「有图但图组空」的脏数据', () => {
      expect(needsGalleryBackfill([newVariant({ portrait_url: 'https://cdn/p.png' })])).toBe(true);
      expect(needsGalleryBackfill([newVariant({ gallery: ['https://cdn/x.png'] })])).toBe(false);
      expect(needsGalleryBackfill([newVariant()])).toBe(false);
    });

    it('ensureBaseVariant：已有形象列表时也补齐图组（读到的形状可稳定回写）', () => {
      // 注意：补齐发生在 AssetService.ensureVariants（列表语境），
      // 纯函数 ensureBaseVariant 只负责字段归一，保持幂等。
      const list = ensureBaseVariant(
        [newVariant({ kind: 'base', portrait_url: 'https://cdn/p.png' })],
        null,
        null,
        1,
      );
      expect(list[0].id).toBeTruthy();
      expect(list[0].gallery).toEqual([]);
      expect(backfillGallery(list[0]).gallery).toEqual(['https://cdn/p.png']);
    });

    it('collectImage：新图入组，替换掉同类的旧图', () => {
      const g = collectImage(['https://cdn/old-portrait.png', 'https://cdn/sheet.png'], 'https://cdn/new.png', 'https://cdn/old-portrait.png');
      expect(g).toEqual(['https://cdn/new.png', 'https://cdn/sheet.png']);
    });

    it('collectImage：没有旧图可替换时追加到末尾', () => {
      const g = collectImage(['https://cdn/a.png'], 'https://cdn/b.png');
      expect(g).toEqual(['https://cdn/a.png', 'https://cdn/b.png']);
    });

    it('collectImage：重复收集同一张不会产生重复项', () => {
      const g = collectImage(['https://cdn/a.png'], 'https://cdn/a.png');
      expect(g).toEqual(['https://cdn/a.png']);
    });

    it('collectImage：超过 4 张丢最旧', () => {
      const g = collectImage(['1', '2', '3', '4'], '5');
      expect(g).toEqual(['2', '3', '4', '5']);
    });

    it('collectImage：替换后仍超上限时同样丢最旧', () => {
      const g = collectImage(['1', '2', '3', '4'], '5', '2');
      // 替换 2 得 [1,5,3,4]，超 4 张丢最旧 → [2 已被替换掉，实际丢 1]
      expect(g.length).toBe(MAX_GALLERY);
      expect(g).toContain('5');
    });
  });

  /**
   * 场景/道具不该有「四视图」。早期误用同一套生图链路，
   * 场景的图组里混进一张白底角色设定图，详情页缩略图行会很突兀。
   */
  describe('按资产类型清洗形象（场景/道具无四视图）', () => {
    it('角色原样返回（四视图保留）', () => {
      const v = newVariant({
        portrait_url: 'https://cdn/p.png',
        sheet_url: 'https://cdn/s.png',
        gallery: ['https://cdn/p.png', 'https://cdn/s.png'],
      });
      expect(sanitizeVariantForType(v, 'character')).toBe(v);
    });

    it('场景清掉 sheet_url 和图组里的同一张', () => {
      const v = newVariant({
        portrait_url: 'https://cdn/p.png',
        sheet_url: 'https://cdn/s.png',
        gallery: ['https://cdn/p.png', 'https://cdn/s.png'],
      });
      const out = sanitizeVariantForType(v, 'scene');
      expect(out.sheet_url).toBeNull();
      expect(out.gallery).toEqual(['https://cdn/p.png']);
      expect(out.portrait_url).toBe('https://cdn/p.png');
    });

    it('道具同样清洗', () => {
      const v = newVariant({
        portrait_url: 'https://cdn/p.png',
        sheet_url: 'https://cdn/s.png',
        gallery: ['https://cdn/s.png'],
      });
      expect(sanitizeVariantForType(v, 'prop').gallery).toEqual([]);
    });

    it('本来就没有四视图时不做多余对象拷贝', () => {
      const v = newVariant({ portrait_url: 'https://cdn/p.png', gallery: ['https://cdn/p.png'] });
      expect(sanitizeVariantForType(v, 'scene')).toBe(v);
    });
  });
});
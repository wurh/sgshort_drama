import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssetItem } from '../../entities/asset-item.entity';
import { Project } from '../../entities/project.entity';
import { AgnesService } from '../generate/agnes.service';
import { EventBusService } from '../generate/event-bus.service';
import { buildAssetPrompt, buildSheetPrompt, composePrompt, normalizeRatio } from './asset-prompt';
import { findStyle } from './styles';
import {
  AssetVariant,
  VariantStatus,
  ensureBaseVariant,
  newVariant,
  parseVariants,
  patchVariant,
  pushGallery,
  removeVariant,
  stringifyVariants,
  collectImage,
  backfillGallery,
  sanitizeVariantForType,
  needsGalleryBackfill,
  MAX_GALLERY,
} from './variants';

export interface AssetView {
  id: number;
  project_id: number;
  type: string;
  name: string;
  desc: string | null;
  base_image_url: string | null;
  extra_images: string[];
  status: string;
  sync_enabled: boolean;
  auto_sync: boolean;
  cost_ms: number | null;
  error: string | null;
  image_count: number;
  /** 形象列表（至少 1 个：「基础形象」）。 */
  variants: AssetVariant[];
  /** 形象 Tab 上展示的短标签（基础形象 / 旧校服 / 少年…）。 */
  variant_names: string[];
}

export interface CreateAssetDto {
  type: 'character' | 'scene' | 'prop';
  name: string;
  desc?: string;
  style_key?: string;
}

/** 资产生成卡死判定阈值：超过该时长仍停在 generating 视为中断（服务重启/请求丢失）。 */
const STUCK_GENERATING_MS = 10 * 60 * 1000;

@Injectable()
export class AssetService {
  private readonly logger = new Logger(AssetService.name);

  constructor(
    @InjectRepository(AssetItem) private readonly repo: Repository<AssetItem>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    private readonly agnes: AgnesService,
    private readonly bus: EventBusService,
  ) {}

  async list(projectId: number, type?: string): Promise<AssetView[]> {
    const where: Record<string, unknown> = { project_id: projectId };
    if (type) where.type = type;
    const rows = await this.repo.find({ where, order: { id: 'ASC' } });
    return this.toViewList(rows);
  }

  async getOne(projectId: number, assetId: number): Promise<AssetView> {
    const a = await this.repo.findOne({ where: { id: assetId, project_id: projectId } });
    if (!a) throw new NotFoundException(`asset ${assetId} not found`);
    const healed = await this.healOne(a);
    // 读详情时就把老数据的形象落库，保证前端拿到的 id 后续写操作能命中
    await this.persistVariantsIfMissing(healed, this.displayVariants(healed));
    return this.toView(healed);
  }

  /** 批量转换 + 自愈：清扫超时仍停在 generating 的僵尸状态，避免前端永久 loading。 */
  private async toViewList(rows: AssetItem[]): Promise<AssetView[]> {
    const now = Date.now();
    for (const a of rows) {
      const age = now - new Date(a.updated_at ?? a.created_at ?? 0).getTime();
      if (a.status === 'generating' && !a.base_image_url && age > STUCK_GENERATING_MS) {
        this.logger.warn(`asset ${a.id}(${a.name}) stuck in generating, reset to pending`);
        await this.repo.update(a.id, { status: 'pending', error: null });
        a.status = 'pending';
        a.error = null;
      }
      // 老数据第一次被列出来时就把形象固定下来，否则列表里的 id 与详情页不一致
      await this.persistVariantsIfMissing(a, this.displayVariants(a));
    }
    return rows.map((a) => this.toView(a));
  }

  /** 单个资产的僵尸态自愈（详情页直接打开也要生效）。 */
  private async healOne(a: AssetItem): Promise<AssetItem> {
    const age = Date.now() - new Date(a.updated_at ?? a.created_at ?? 0).getTime();
    if (a.status === 'generating' && !a.base_image_url && age > STUCK_GENERATING_MS) {
      await this.repo.update(a.id, { status: 'pending', error: null });
      a.status = 'pending';
      a.error = null;
    }
    return a;
  }

  async create(projectId: number, dto: CreateAssetDto): Promise<AssetView> {
    if (!dto.name?.trim()) {
      throw new BadRequestException('asset name required');
    }
    const style = findStyle(dto.style_key);
    const base = newVariant({
      name: '基础形象',
      kind: 'base',
      style_key: style?.key ?? null,
    });
    const a = await this.repo.save(
      this.repo.create({
        project_id: projectId,
        type: dto.type,
        name: dto.name.trim(),
        desc: dto.desc,
        // 新建即待生成；generating 只在真正发起生图时置位
        status: 'pending',
        sync_enabled: true,
        auto_sync: false,
        variants: stringifyVariants([base]),
      }),
    );
    return this.toView(a);
  }

  /**
   * 为项目内某资产生成基础形象（文生图，角色 3:4、场景/道具 16:9）。
   * 结果同时写入 base_image_url（供分镜参考图）与 variants[0].portrait_url。
   */
  async generateBase(projectId: number, assetId: number): Promise<AssetView> {
    const a = await this.repo.findOne({ where: { id: assetId, project_id: projectId } });
    if (!a) throw new NotFoundException(`asset ${assetId} not found`);
    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    let variants = this.ensureVariants(a);
    const baseVariant = variants[0];
    const style = findStyle(baseVariant.style_key);
    const prompt = buildAssetPrompt(a, a.type as 'character' | 'scene' | 'prop', project?.style);
    const finalPrompt = composePrompt(prompt.prompt, baseVariant.desc, style?.prompt);

    this.bus.publish({
      projectId, type: 'asset', refId: a.id,
      message: `正在为「${a.name}」生成基础形象（${prompt.ratio}）…`, ts: Date.now(),
    });
    await this.repo.update(a.id, { status: 'generating', error: null });
    variants = this.markVariant(variants, baseVariant.id, { status: 'generating', error: null });

    const result = await this.agnes.generateImage(finalPrompt, {
      ratio: prompt.ratio,
      size: prompt.size,
    });
    if (result.error) {
      await this.repo.update(a.id, {
        status: 'failed',
        error: result.error,
        cost_ms: result.costMs,
        // 失败时仍落库 variants 的失败态，详情页才能显示「重试」
        variants: stringifyVariants(
          this.markVariant(variants, baseVariant.id, {
            status: 'failed',
            error: result.error,
          }),
        ),
      });
      this.bus.publish({
        projectId, type: 'asset', refId: a.id,
        message: `「${a.name}」基础形象生成失败：${result.error}`, ts: Date.now(),
      });
      return this.toView(await this.repo.findOne({ where: { id: a.id } }));
    }
    const url = result.outUrl ?? result.outPath;
    await this.repo.update(a.id, {
      base_image_url: url,
      status: 'done',
      error: null,
      cost_ms: result.costMs,
      variants: stringifyVariants(
        this.markVariant(variants, baseVariant.id, {
          status: 'done',
          portrait_url: url,
          // 生成的图直接进图组，否则列表卡「已添加形象」永远是 0
          gallery: collectImage(baseVariant.gallery, url, baseVariant.portrait_url),
          model: this.imageModelName(),
          cost_ms: result.costMs,
          error: null,
        }),
      ),
    });
    this.bus.publish({
      projectId, type: 'asset', refId: a.id, outUrl: url,
      message: `「${a.name}」基础形象已生成 ✓（${result.costMs}ms）`, ts: Date.now(),
    });
    return this.toView(await this.repo.findOne({ where: { id: a.id } }));
  }

  // ---------- 形象（variant）管理 ----------

  /** 新建一个形象（空壳，待生成），对齐详情页「+ 添加 → 创建新形象」。 */
  async createVariant(
    projectId: number,
    assetId: number,
    dto: { name?: string; desc?: string; style_key?: string },
  ): Promise<AssetView> {
    const a = await this.repo.findOne({ where: { id: assetId, project_id: projectId } });
    if (!a) throw new NotFoundException(`asset ${assetId} not found`);
    const variants = this.ensureVariants(a);
    const style = findStyle(dto.style_key);
    const v = newVariant({
      name: dto.name?.trim() || `新形象${variants.length}`,
      desc: dto.desc ?? '',
      style_key: style?.key ?? null,
      kind: 'custom',
    });
    await this.repo.update(a.id, {
      variants: stringifyVariants([...variants, v]),
    });
    this.bus.publish({
      projectId, type: 'asset', refId: a.id,
      message: `已为「${a.name}」新增形象「${v.name}」`, ts: Date.now(),
    });
    return this.toView(await this.repo.findOne({ where: { id: a.id } }));
  }

  /** 更新形象属性（名称/描述/风格/应用范围）。 */
  async updateVariant(
    projectId: number,
    assetId: number,
    variantId: string,
    patch: {
      name?: string;
      desc?: string;
      style_key?: string | null;
      apply_to_all?: boolean;
    },
  ): Promise<AssetView> {
    const a = await this.repo.findOne({ where: { id: assetId, project_id: projectId } });
    if (!a) throw new NotFoundException(`asset ${assetId} not found`);
    const variants = this.ensureVariants(a);
    const clean: Partial<AssetVariant> = {};
    if (typeof patch.name === 'string' && patch.name.trim()) clean.name = patch.name.trim();
    if (typeof patch.desc === 'string') clean.desc = patch.desc;
    if (patch.style_key !== undefined) {
      clean.style_key = findStyle(patch.style_key)?.key ?? null;
    }
    if (typeof patch.apply_to_all === 'boolean') clean.apply_to_all = patch.apply_to_all;
    const { list, updated } = patchVariant(variants, variantId, clean);
    if (!updated) throw new NotFoundException(`variant ${variantId} not found`);
    await this.repo.update(a.id, { variants: stringifyVariants(list) });
    // 基础形象的名称不同步到资产名，避免用户改形象名把资产名也改了
    return this.toView(await this.repo.findOne({ where: { id: a.id } }));
  }

  /** 删除形象（基础形象不可删）。 */
  async deleteVariant(
    projectId: number,
    assetId: number,
    variantId: string,
  ): Promise<AssetView> {
    const a = await this.repo.findOne({ where: { id: assetId, project_id: projectId } });
    if (!a) throw new NotFoundException(`asset ${assetId} not found`);
    const { list, removed } = removeVariant(this.ensureVariants(a), variantId);
    if (!removed) throw new BadRequestException('基础形象不可删除');
    await this.repo.update(a.id, { variants: stringifyVariants(list) });
    return this.toView(await this.repo.findOne({ where: { id: a.id } }));
  }

  /**
   * 生成指定形象的图片。
   * - kind='portrait'：主图。角色是竖版立绘（3:4），场景/道具是横版场景图（16:9）。
   * - kind='sheet'：四视图（仅角色，16:9），以已生成的立绘为参考图保证一致。
   *
   * 场景/道具没有「四视图」概念，对它传 sheet 直接拒绝，
   * 否则会用「角色设定四视图」的 prompt 生成一张毫无意义的图。
   */
  async generateVariantImage(
    projectId: number,
    assetId: number,
    variantId: string,
    kind: 'portrait' | 'sheet',
    ratioOverride?: string,
  ): Promise<AssetView> {
    const a = await this.repo.findOne({ where: { id: assetId, project_id: projectId } });
    if (!a) throw new NotFoundException(`asset ${assetId} not found`);
    if (kind === 'sheet' && a.type !== 'character') {
      throw new BadRequestException('场景/道具不支持四视图，请直接生成主图');
    }
    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    let variants = this.ensureVariants(a);
    const target = variants.find((v) => v.id === variantId);
    if (!target) throw new NotFoundException(`variant ${variantId} not found`);

    const style = findStyle(target.style_key);
    const type = a.type as 'character' | 'scene' | 'prop';
    const subject = { name: a.name, desc: target.desc || a.desc };
    const base = kind === 'portrait'
      ? buildAssetPrompt(subject, type, project?.style)
      : buildSheetPrompt(subject, type);
    const finalPrompt = composePrompt(base.prompt, target.desc, style?.prompt);
    // 场景页的比例控件（16:9 / 1:1 / 3:4）由此生效；非法值回落到类型默认值
    const ratio = normalizeRatio(ratioOverride) ?? base.ratio;

    this.bus.publish({
      projectId, type: 'asset', refId: a.id,
      message: `正在为「${a.name} · ${target.name}」生成${kind === 'portrait' ? '立绘' : '四视图'}…`,
      ts: Date.now(),
    });
    variants = this.markVariant(variants, variantId, { status: 'generating', error: null });
    await this.repo.update(a.id, {
      status: 'generating',
      error: null,
      variants: stringifyVariants(variants),
    });

    const result = await this.agnes.generateImage(finalPrompt, {
      ratio,
      size: base.size,
      // 四视图以立绘为参考，保证服装/长相一致
      refImages: kind === 'sheet' && target.portrait_url ? [target.portrait_url] : [],
    });

    if (result.error) {
      const failed = this.markVariant(this.ensureVariants(a), variantId, {
        status: target.portrait_url ? 'done' : 'failed',
        error: result.error,
      });
      await this.repo.update(a.id, {
        status: a.base_image_url ? 'done' : 'failed',
        error: result.error,
        variants: stringifyVariants(failed),
      });
      this.bus.publish({
        projectId, type: 'asset', refId: a.id,
        message: `「${a.name} · ${target.name}」生成失败：${result.error}`, ts: Date.now(),
      });
      return this.toView(await this.repo.findOne({ where: { id: a.id } }));
    }

    const url = result.outUrl ?? result.outPath;
    const patch: Partial<AssetVariant> =
      kind === 'portrait'
        ? { portrait_url: url }
        : { sheet_url: url };
    let next = this.markVariant(this.ensureVariants(a), variantId, {
      ...patch,
      // 生成出来的图直接收进图组（并替换掉同类的旧图），
      // 否则「已添加形象 n/4」和缩略图一直是空的，看起来像没生成成功。
      // 先 backfill 一次：图组空但已有立绘时，生成四视图后组内要能同时看到两张。
      gallery: collectImage(
        backfillGallery(target).gallery,
        url,
        kind === 'portrait' ? target.portrait_url : target.sheet_url,
      ),
      status: 'done',
      error: null,
      model: this.imageModelName(),
      cost_ms: result.costMs,
    });
    // 形象有了立绘就同步回基础图（分镜参考图取 base_image_url）
    const updatedVariant = next.find((v) => v.id === variantId);
    const isBase = updatedVariant?.kind === 'base';
    const patchRow: Record<string, unknown> = {
      status: a.base_image_url || kind === 'portrait' ? 'done' : a.status,
      error: null,
      cost_ms: result.costMs,
      variants: stringifyVariants(next),
    };
    if (kind === 'portrait' && url) {
      // 基础形象出图才覆盖 base_image_url；自定义形象也覆盖，保证分镜用的是最新形象
      patchRow.base_image_url = url;
      patchRow.status = 'done';
    }
    await this.repo.update(a.id, patchRow);
    this.bus.publish({
      projectId, type: 'asset', refId: a.id, outUrl: url,
      message: `「${a.name} · ${target.name}」${kind === 'portrait' ? '立绘' : '四视图'}已生成 ✓（${result.costMs}ms）`,
      ts: Date.now(),
    });
    return this.toView(await this.repo.findOne({ where: { id: a.id } }));
  }

  /** 追加图片到某形象图组（上限 MAX_GALLERY，超出丢最旧）。 */
  async addVariantGallery(
    projectId: number,
    assetId: number,
    variantId: string,
    url: string,
  ): Promise<AssetView> {
    const a = await this.repo.findOne({ where: { id: assetId, project_id: projectId } });
    if (!a) throw new NotFoundException(`asset ${assetId} not found`);
    if (!url?.trim()) throw new BadRequestException('url required');
    const variants = this.ensureVariants(a);
    const target = variants.find((v) => v.id === variantId);
    if (!target) throw new NotFoundException(`variant ${variantId} not found`);
    const next = variants.map((v) =>
      v.id === variantId ? pushGallery(v, [url.trim()]) : v,
    );
    await this.repo.update(a.id, { variants: stringifyVariants(next) });
    return this.toView(await this.repo.findOne({ where: { id: a.id } }));
  }

  /**
   * 添加形象（多视图追加）。
   * - 传 url：直接把该 url 追加进基础形象的图组（外部素材导入）。
   * - 不传 url：以基础形象为参考再生成一个不同视角，写入图组。
   */
  async addImage(projectId: number, assetId: number, url?: string): Promise<AssetView> {
    const a = await this.repo.findOne({ where: { id: assetId, project_id: projectId } });
    if (!a) throw new NotFoundException(`asset ${assetId} not found`);
    const variants = this.ensureVariants(a);
    const baseVariant = variants[0];

    if (url) {
      const next = pushGallery(baseVariant, [url]);
      let list = variants.map((v) => (v.id === baseVariant.id ? next : v));
      await this.repo.update(a.id, {
        extra_images: JSON.stringify(this.extraFromGallery(next.gallery, a.base_image_url)),
        variants: stringifyVariants(list),
      });
      return this.toView(await this.repo.findOne({ where: { id: a.id } }));
    }

    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    const style = findStyle(baseVariant.style_key);
    const base = buildAssetPrompt(a, a.type as 'character' | 'scene' | 'prop', project?.style);
    const variantPrompt = composePrompt(
      `${base.prompt}；同一${a.type === 'character' ? '角色' : '对象'}的另一个视角，保持外观与配色一致`,
      baseVariant.desc,
      style?.prompt,
    );
    this.bus.publish({
      projectId, type: 'asset', refId: a.id,
      message: `正在为「${a.name}」追加形象（多视图）…`, ts: Date.now(),
    });
    await this.repo.update(a.id, { status: 'generating', error: null });
    const result = await this.agnes.generateImage(variantPrompt, {
      ratio: base.ratio,
      size: base.size,
      refImages: a.base_image_url ? [a.base_image_url] : [],
    });
    if (result.error) {
      await this.repo.update(a.id, {
        status: a.base_image_url ? 'done' : 'failed',
        error: result.error,
      });
      this.bus.publish({
        projectId, type: 'asset', refId: a.id,
        message: `「${a.name}」追加形象失败：${result.error}`, ts: Date.now(),
      });
      return this.toView(await this.repo.findOne({ where: { id: a.id } }));
    }
    const out = result.outUrl ?? result.outPath;
    const next = out ? pushGallery(baseVariant, [out]) : baseVariant;
    const list = variants.map((v) => (v.id === baseVariant.id ? next : v));
    await this.repo.update(a.id, {
      extra_images: JSON.stringify(this.extraFromGallery(next.gallery, a.base_image_url)),
      status: 'done',
      error: null,
      cost_ms: result.costMs,
      variants: stringifyVariants(list),
    });
    this.bus.publish({
      projectId, type: 'asset', refId: a.id, outUrl: out,
      message: `「${a.name}」已追加形象 ✓（共 ${next.gallery.length}/${MAX_GALLERY} 张）`, ts: Date.now(),
    });
    return this.toView(await this.repo.findOne({ where: { id: a.id } }));
  }

  /**
   * 批量生成基础形象：只处理还没有基础形象的资产（可再按 type 过滤）。
   * 串行执行避免并发打爆上游限流，前端可通过列表轮询/SSE 看进度。
   */
  async batchGenerateBase(
    projectId: number,
    type?: string,
  ): Promise<{ total: number; done: number; failed: number }> {
    const where: Record<string, unknown> = { project_id: projectId };
    if (type) where.type = type;
    const rows = await this.repo.find({ where, order: { id: 'ASC' } });
    const targets = rows.filter((a) => !a.base_image_url && a.status !== 'generating');
    let done = 0;
    let failed = 0;
    for (const a of targets) {
      const r = await this.generateBase(projectId, a.id);
      if (r.status === 'done') done += 1;
      else failed += 1;
    }
    this.bus.publish({
      projectId, type: 'asset',
      message: `批量生图结束：成功 ${done} / 失败 ${failed}（共 ${targets.length}）`,
      ts: Date.now(),
    });
    return { total: targets.length, done, failed };
  }

  /** 同步资产开关 / 自动同步开关。 */
  async toggleSync(projectId: number, assetId: number, sync: boolean, auto?: boolean): Promise<AssetView> {
    const a = await this.repo.findOne({ where: { id: assetId, project_id: projectId } });
    if (!a) throw new NotFoundException(`asset ${assetId} not found`);
    const patch: Record<string, unknown> = { sync_enabled: sync };
    if (typeof auto === 'boolean') patch.auto_sync = auto;
    await this.repo.update(a.id, patch);
    return this.toView(await this.repo.findOne({ where: { id: a.id } }));
  }

  /** 批量设置整个项目的同步开关（顶部「同步资产」「自动同步」）。 */
  async setProjectSync(
    projectId: number,
    payload: { sync_enabled?: boolean; auto_sync?: boolean },
  ): Promise<{ updated: number }> {
    const patch: Record<string, unknown> = {};
    if (typeof payload.sync_enabled === 'boolean') patch.sync_enabled = payload.sync_enabled;
    if (typeof payload.auto_sync === 'boolean') patch.auto_sync = payload.auto_sync;
    if (Object.keys(patch).length === 0) return { updated: 0 };
    const rows = await this.repo.find({ where: { project_id: projectId } });
    for (const r of rows) await this.repo.update(r.id, patch);
    return { updated: rows.length };
  }

  /** 删除资产（被镜头引用时软删保护：标记未同步，不硬删）。TC-E / TC-AS 异常。 */
  async remove(projectId: number, assetId: number): Promise<{ deleted: boolean; protected: boolean }> {
    const a = await this.repo.findOne({ where: { id: assetId, project_id: projectId } });
    if (!a) return { deleted: false, protected: false };
    await this.repo.update(a.id, { sync_enabled: false });
    await this.repo.remove(a);
    this.bus.publish({
      projectId, type: 'asset', refId: assetId,
      message: `资产「${a.name}」已删除（标记未同步）`, ts: Date.now(),
    });
    return { deleted: true, protected: true };
  }

  // ---------- 内部工具 ----------

  private imageModelName(): string | null {
    // 仅作展示回溯用，取不到就给 null，不影响业务
    try {
      return this.agnes.imageModelName() ?? null;
    } catch {
      return null;
    }
  }

  private ensureVariants(a: AssetItem): AssetVariant[] {
    const list = parseVariants(a.variants);
    // 老数据兼容：variants 列还没写、只有 extra_images 时，这些历史追加图
    // 本身就是形象图，优先用它们填图组；没有历史图再回退「立绘 → 四视图」。
    // 不处理的话「已添加形象 n/m」会显示成 0，和实际图数不一致。
    const extra = this.parseExtra(a.extra_images);
    return ensureBaseVariant(
      list,
      a.base_image_url,
      this.imageModelName(),
      a.id,
    ).map((v, i) => {
      if (i !== 0 || v.gallery.length > 0) return v;
      if (extra.length) {
        return { ...v, gallery: extra.slice(-MAX_GALLERY) };
      }
      return v;
    });
  }

  /**
   * 展示用形象列表：图组为空但有立绘/四视图时，用它们兜底填图组；
   * 非角色资产还要清掉误生成的「四视图」——场景页只该有一张横版图。
   * 只在读出/渲染用，写路径仍走 ensureVariants，避免把「兜底结果」当成用户数据。
   */
  private displayVariants(a: AssetItem): AssetVariant[] {
    return this.ensureVariants(a)
      .map((v) => backfillGallery(v))
      .map((v) => sanitizeVariantForType(v, a.type));
  }

  /**
   * 读路径的兜底落库。
   *
   * 两种情况需要写回：
   * 1. variants 列是 NULL（老资产）——每次读都会现场合成基础形象，一旦中间夹了写操作
   *    就会重新合成另一份，形成"读到的 id 写不回去"的死循环；
   * 2. 形象有立绘/四视图但图组是空的——列表卡片会显示「已添加形象 0/4」+ 一排空框，
   *    用户看到的观感就是「图都生成完了，却没有形象」。这里一次性把图补进图组。
   *
   * 失败不影响读（只是下次还会再合成一次），故吞异常。
   */
  private async persistVariantsIfMissing(a: AssetItem, list: AssetVariant[]): Promise<void> {
    const raw = stringifyVariants(list);
    // 与库里存的内容逐字比较：形状一致就不写，避免每次读都产生一次 UPDATE。
    // 注意不能只判 `!a.variants`——「有立绘但图组空」的老数据 variants 是有的，
    // 只是内容缺图组，那种也要回写一次。
    if (a.variants === raw) return;
    try {
      await this.repo.update(a.id, { variants: raw });
      a.variants = raw;
    } catch (e) {
      this.logger.warn(`asset ${a.id} 形象归一化落库失败：${(e as Error).message}`);
    }
  }

  private markVariant(
    list: AssetVariant[],
    id: string,
    patch: Partial<AssetVariant>,
  ): AssetVariant[] {
    return patchVariant(list, id, patch).list;
  }

  private parseExtra(raw: string | null): string[] {
    try {
      const v = raw ? JSON.parse(raw) : [];
      return Array.isArray(v) ? v.filter((u) => typeof u === 'string' && u.length > 0) : [];
    } catch {
      return [];
    }
  }

  /**
   * 图组 → extra_images（分镜参考图用的「追加图」）。
   * 图组里现在会带上基础主图，但 extra_images 的语义是「主图之外追加的图」，
   * 所以要把主图那一张排除掉，否则 image_count 会重复计数。
   *
   * 只按位置去掉**第一张**命中的主图：主图与追加图恰好同 url 时（测试里的
   * mock 就固定返回同一个地址）仍然保留一张，不能把追加图一起抹掉。
   */
  private extraFromGallery(gallery: string[], baseUrl: string | null): string[] {
    const out = gallery.filter((u) => Boolean(u));
    if (!baseUrl) return out;
    const at = out.indexOf(baseUrl);
    if (at >= 0) out.splice(at, 1);
    return out;
  }

  private toView(a: AssetItem): AssetView {
    const extra = this.parseExtra(a.extra_images);
    // 展示口径统一走 displayVariants：图有了就必须能在「已添加形象 n/4」里看到
    const variants = this.displayVariants(a);
    return {
      id: a.id,
      project_id: a.project_id,
      type: a.type,
      name: a.name,
      desc: a.desc,
      base_image_url: a.base_image_url,
      extra_images: extra,
      status: a.status,
      sync_enabled: a.sync_enabled,
      auto_sync: a.auto_sync,
      cost_ms: a.cost_ms,
      error: a.error,
      image_count: a.base_image_url ? 1 + extra.length : extra.length,
      variants,
      variant_names: variants.map((v) => v.name),
    };
  }
}
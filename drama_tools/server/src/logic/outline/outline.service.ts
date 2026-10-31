import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Outline } from '../../entities/outline.entity';
import { AssetItem } from '../../entities/asset-item.entity';
import { Project } from '../../entities/project.entity';
import { Episode } from '../../entities/episode.entity';
import { AgnesService } from '../generate/agnes.service';
import { EventBusService } from '../generate/event-bus.service';
import { BizError, ERR } from '../../common/errors';
import { parseOutlineJson } from './outline-parser';
import type { OutlineResult } from '../generate/types';

/** 大纲页展示结构。 */
export interface OutlineView {
  id: number;
  project_id: number;
  version: number;
  episodes: OutlineResult['episodes'];
  characters: OutlineResult['characters'];
  scenes: OutlineResult['scenes'];
  props: OutlineResult['props'];
  status: string;
}

@Injectable()
export class OutlineService {
  private readonly logger = new Logger(OutlineService.name);

  constructor(
    @InjectRepository(Outline) private readonly outlineRepo: Repository<Outline>,
    @InjectRepository(AssetItem) private readonly assetRepo: Repository<AssetItem>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    @InjectRepository(Episode) private readonly episodeRepo: Repository<Episode>,
    private readonly agnes: AgnesService,
    private readonly bus: EventBusService,
    private readonly config: ConfigService,
  ) {}

  private style(project: Project): string {
    return project.style ?? '写实短剧';
  }

  /** 判断模型错误是否为「未配置 Key」：重试无意义，需明确提示运维动作。 */
  private isMissingKey(error: string): boolean {
    return /api[_-]?key\s*missing|api[_-]?key.*not\s*(set|configured)/i.test(error);
  }

  /**
   * 步骤 1：生成剧本大纲（TC-OL / UT-BE-01）。
   * - 调 Agnes-3.0-Flash，parseOutlineJson 校验（容忍 ```json 包裹）。
   * - 失败自动带错误信息重试 1 次；仍失败不落脏数据，抛可读错误。
   * - 成功后落 outline + 生成资产草稿（asset_item 初始行 status=generating）。
   */
  async generateOutline(projectId: number): Promise<OutlineView> {
    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    if (!project) throw new NotFoundException(`project ${projectId} not found`);

    const prompt =
      `请根据以下创意生成分集短剧大纲，严格按 JSON 输出：` +
      `{"episodes":[{"title":"","summary":"","seconds":0,"characters":[],"scenes":[]}],` +
      `"characters":[{"name":"","desc":""}],"scenes":[{"name":"","desc":""}],"props":[{"name":"","desc":""}]}。\n` +
      `创意：${project.creative}\n风格：${this.style(project)}\n集数：${project.episode_count}（每集约 ${project.target_seconds}s）。\n` +
      `只输出 JSON，不要其他内容。`;
    const system = '你是资深短剧编剧，擅长一句话创意拆成完整分集大纲。';

    this.bus.publish({
      projectId, type: 'think', stage: 'outline',
      message: '正在调用 Agnes-3.0-Flash 生成分集大纲…', ts: Date.now(),
    });

    let parsed: OutlineResult | null = null;
    let lastError = '';
    let configMissing = false;
    for (let attempt = 0; attempt < 2 && !parsed; attempt++) {
      const retryHint = attempt === 1 && lastError ? `\n（上次失败：${lastError}，请简化并严格输出 JSON）` : '';
      const res = await this.agnes.generateText(prompt + retryHint, system);
      if (res.error) {
        lastError = res.error;
        // 配置缺失属于部署问题，重试无意义，直接中断并明确告知
        if (this.isMissingKey(res.error)) {
          configMissing = true;
          this.bus.publish({
            projectId, type: 'tool', stage: 'outline_retry',
            message: '未配置 AGNES_API_KEY，已中止生成', ts: Date.now(),
          });
          break;
        }
        this.bus.publish({
          projectId, type: 'tool', stage: 'outline_retry',
          message: `大纲生成第 ${attempt + 1} 次失败：${res.error}`, ts: Date.now(),
        });
        continue;
      }
      parsed = parseOutlineJson(res.content);
      if (!parsed) {
        lastError = 'JSON 解析失败';
        this.bus.publish({
          projectId, type: 'tool', stage: 'outline_retry',
          message: '大纲 JSON 解析失败，自动重试 1 次…', ts: Date.now(),
        });
      }
    }

    if (!parsed) {
      const err = configMissing
        ? ERR.MODEL_NOT_CONFIGURED
        : new BizError(
            ERR.MODEL_BAD_OUTPUT.code,
            `模型调用失败：${lastError || '未知错误'}`,
            ERR.MODEL_BAD_OUTPUT.httpStatus,
          );
      // done 事件的 message 会被 SSE 前端展示，用可读的最终原因
      this.bus.publish({ projectId, type: 'done', message: err.message, ts: Date.now() });
      this.bus.finalize(projectId);
      throw err;
    }

    // 落 outline（先删旧版本避免脏数据）
    await this.outlineRepo.delete({ project_id: projectId });
    const outline = await this.outlineRepo.save(
      this.outlineRepo.create({
        project_id: projectId,
        episodes_json: JSON.stringify(parsed.episodes),
        characters_json: JSON.stringify(parsed.characters),
        scenes_json: JSON.stringify(parsed.scenes),
        props_json: JSON.stringify(parsed.props),
        version: 1,
      }),
    );

    // 生成资产草稿（asset_item 初始行，status=generating）+ 分集行
    await this.seedAssets(projectId, parsed, project.style ?? '');
    await this.seedEpisodes(projectId, parsed, project.target_seconds);

    // 推进项目状态
    await this.projectRepo.update(projectId, { status: 'asset_ready' });
    this.bus.publish({
      projectId, type: 'outline',
      message: `大纲完成：${parsed.episodes.length} 集 / ${parsed.characters.length} 角色 / ${parsed.scenes.length} 场景 / ${parsed.props.length} 道具`,
      ts: Date.now(),
    });
    this.bus.publish({ projectId, type: 'done', message: '大纲生成完成', ts: Date.now() });
    this.bus.finalize(projectId);

    return this.toView(outline, 'asset_ready');
  }

  /** 编辑/保存大纲（改集/删集/加集/改角色/场景/道具）。 */
  async save(projectId: number, payload: OutlineResult): Promise<OutlineView> {
    const exists = await this.outlineRepo.findOne({ where: { project_id: projectId } });
    const rows = {
      project_id: projectId,
      episodes_json: JSON.stringify(payload.episodes ?? []),
      characters_json: JSON.stringify(payload.characters ?? []),
      scenes_json: JSON.stringify(payload.scenes ?? []),
      props_json: JSON.stringify(payload.props ?? []),
      version: exists ? exists.version + 1 : 1,
    };
    const outline = exists
      ? await this.outlineRepo.update(exists.id, rows)
      : await this.outlineRepo.save(this.outlineRepo.create({ ...rows, version: 1 }));
    if (exists) {
      const reloaded = await this.outlineRepo.findOne({ where: { project_id: projectId } });
      return this.toView(reloaded, 'asset_ready');
    }
    return this.toView(
      await this.outlineRepo.findOne({ where: { project_id: projectId } }),
      'asset_ready',
    );
  }

  async view(projectId: number): Promise<OutlineView | null> {
    const outline = await this.outlineRepo.findOne({ where: { project_id: projectId } });
    if (!outline) return null;
    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    return this.toView(outline, project?.status ?? 'pending');
  }

  private async seedAssets(projectId: number, o: OutlineResult, style: string) {
    // 先清旧草稿（同 project 旧 generating 状态资产）避免重复
    const chars = o.characters.filter((c) => c.name);
    const scenes = o.scenes.filter((s) => s.name);
    const props = o.props.filter((p) => p.name);
    const rows = [
      ...chars.map((c) => ({ type: 'character', name: c.name, desc: c.desc })),
      ...scenes.map((s) => ({ type: 'scene', name: s.name, desc: s.desc })),
      ...props.map((p) => ({ type: 'prop', name: p.name, desc: p.desc })),
    ];
    // 幂等：同名同类型已存在则跳过
    const existing = await this.assetRepo.find({ where: { project_id: projectId } });
    const keySet = new Set(existing.map((a) => `${a.type}:${a.name}`));
    const toCreate = rows.filter((r) => !keySet.has(`${r.type}:${r.name}`));
    if (toCreate.length) {
      await this.assetRepo.save(
        toCreate.map((r) =>
          this.assetRepo.create({
            project_id: projectId,
            type: r.type,
            name: r.name,
            desc: r.desc,
            // 草稿只登记、未生图 → pending。绝不能用 generating：
            // 前端会把 generating 当作"进行中"而永久 loading 且禁用按钮。
            status: 'pending',
            sync_enabled: true,
            auto_sync: false,
          }),
        ),
      );
    }
  }

  private async seedEpisodes(projectId: number, o: OutlineResult, targetSeconds: number) {
    const existing = await this.episodeRepo.find({ where: { project_id: projectId } });
    const count = Math.max(o.episodes.length, 1);
    for (let i = 0; i < count; i++) {
      if (i < existing.length) {
        // 已有分集行：刷新标题/简介/秒数
        const ep = existing[i];
        const src = o.episodes[i];
        await this.episodeRepo.update(ep.id, {
          seq: i + 1,
          title: src?.title ?? ep.title,
          summary: src?.summary ?? ep.summary,
          seconds: src?.seconds ?? targetSeconds,
          status: 'draft',
        });
      } else {
        const src = o.episodes[i];
        await this.episodeRepo.save(
          this.episodeRepo.create({
            project_id: projectId,
            seq: i + 1,
            title: src?.title ?? `第${i + 1}集`,
            summary: src?.summary ?? '',
            seconds: src?.seconds ?? targetSeconds,
            status: 'draft',
          }),
        );
      }
    }
  }

  private toView(outline: Outline | null, status: string): OutlineView {
    const parse = <T>(s: string | null, fallback: T): T => {
      try {
        return s ? (JSON.parse(s) as T) : fallback;
      } catch {
        return fallback;
      }
    };
    return {
      id: outline?.id ?? 0,
      project_id: outline?.project_id ?? 0,
      version: outline?.version ?? 1,
      episodes: parse<OutlineResult['episodes']>(outline?.episodes_json ?? null, []),
      characters: parse<OutlineResult['characters']>(outline?.characters_json ?? null, []),
      scenes: parse<OutlineResult['scenes']>(outline?.scenes_json ?? null, []),
      props: parse<OutlineResult['props']>(outline?.props_json ?? null, []),
      status,
    };
  }
}

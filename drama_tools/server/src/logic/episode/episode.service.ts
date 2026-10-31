import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/configuration';
import { Episode } from '../../entities/episode.entity';
import { Keyframe } from '../../entities/keyframe.entity';
import { EpisodeVideo } from '../../entities/episode-video.entity';
import { ModelTask } from '../../entities/model-task.entity';
import { AssetItem } from '../../entities/asset-item.entity';
import { Project } from '../../entities/project.entity';
import { AgnesService } from '../generate/agnes.service';
import { EventBusService } from '../generate/event-bus.service';
import { VideoQueueService } from '../generate/video-queue.service';
import { FfmpegService } from '../generate/ffmpeg.service';
import { parseScriptJson } from './script-parser';
import { assignKeyframeSeq } from './assign-seq';
import {
  ImageHistoryItem,
  SegmentShot,
  addShot,
  chunkShots,
  newShot,
  parseHistory,
  parseShots,
  patchShot,
  pushHistory,
  removeShot,
  shotsSeconds,
  stringifyHistory,
  stringifyShots,
} from './segments';
import { pickRefImages } from '../generate/ref-pick';
import { buildImageParams } from '../generate/image-params';
import { BizError, ERR } from '../../common/errors';
import {
  KeyframeDto,
  AddKeyframeDto,
  MoveKeyframeDto,
  GenerateScriptDto,
  GenerateImageDto,
  GenerateVideoDto,
  BatchVideoDto,
  BatchDownloadDto,
  AddShotDto,
  EditSegmentDto,
  ReorderSegmentsDto,
  CreateEpisodeDto,
} from './episode.dto';

export interface EpisodeStats {
  episode_id: number;
  seq: number;
  title: string | null;
  status: string;
  character_count: number;
  scene_count: number;
  /** 片段（Segment）数。 */
  keyframe_count: number;
  /** 分镜（片段内的镜头）总数，对齐设计稿「N个镜头」。 */
  shot_count: number;
  total_seconds: number;
  /** 封面图：优先第一个已出图的片段，其次成片。 */
  cover_url: string | null;
  /** 是否已有成片。 */
  video_url: string | null;
  /** 已出图的分镜数 / 分镜总数，供卡片「生成中」判定。 */
  image_done: number;
}

/** 每多少个分镜归并为一个片段（设计稿一屏内 2~4 个分镜）。 */
const SHOTS_PER_SEGMENT = 2;

/**
 * 归一化画面比例：只接受白名单档位，非法值回落到调用方给的默认值。
 * 生成面板的「比例」下拉与资产详情页共用同一套口径。
 * 注意不能用「任意 X:Y 格式都放行」——`5:7` 格式合法但上游不支持，
 * 传过去会直接 400，比回落默认值更糟。
 */
export const ALLOWED_RATIOS = ['16:9', '9:16', '1:1', '3:4', '4:3'] as const;

export function normalizeRatio(raw: string | null | undefined, fallback: string): string {
  if (!raw) return fallback;
  const v = String(raw).trim();
  return (ALLOWED_RATIOS as readonly string[]).includes(v) ? v : fallback;
}

@Injectable()
export class EpisodeService {
  private readonly logger = new Logger(EpisodeService.name);

  constructor(
    @InjectRepository(Episode) private readonly episodeRepo: Repository<Episode>,
    @InjectRepository(Keyframe) private readonly keyframeRepo: Repository<Keyframe>,
    @InjectRepository(EpisodeVideo) private readonly videoRepo: Repository<EpisodeVideo>,
    @InjectRepository(ModelTask) private readonly taskRepo: Repository<ModelTask>,
    @InjectRepository(AssetItem) private readonly assetRepo: Repository<AssetItem>,
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    private readonly agnes: AgnesService,
    private readonly bus: EventBusService,
    private readonly videoQueue: VideoQueueService,
    private readonly ffmpeg: FfmpegService,
    private readonly config: ConfigService,
  ) {}

  // ---------- 分集卡片统计（TC-SP） ----------
  async listWithStats(projectId: number): Promise<EpisodeStats[]> {
    const episodes = await this.episodeRepo.find({
      where: { project_id: projectId },
      order: { seq: 'ASC' },
    });
    const out: EpisodeStats[] = [];
    for (const ep of episodes) {
      const kfs = await this.keyframeRepo.find({
        where: { episode_id: ep.id },
        order: { seq: 'ASC' },
      });
      const chars = new Set<number>();
      const scenes = new Set<number>();
      let total = 0;
      let shotCount = 0;
      let imageDone = 0;
      let cover: string | null = null;
      for (const kf of kfs) {
        const shots = this.ensureShots(kf);
        shotCount += shots.length;
        total += shots.length ? shotsSeconds(shots) : kf.seconds || 0;
        for (const c of this.parseRefs(kf.character_refs)) chars.add(c);
        for (const s of this.parseRefs(kf.scene_refs)) scenes.add(s);
        const img = kf.keyframe_url || kf.shot_image_url;
        if (img) {
          imageDone += 1;
          if (!cover) cover = img;
        }
      }
      const video = await this.videoRepo.findOne({ where: { episode_id: ep.id } });
      const readyVideo = video?.status === 'ready' ? video.url : null;
      out.push({
        episode_id: ep.id,
        seq: ep.seq,
        title: ep.title,
        status: ep.status,
        character_count: chars.size,
        scene_count: scenes.size,
        keyframe_count: kfs.length,
        shot_count: shotCount,
        total_seconds: total,
        cover_url: cover ?? readyVideo ?? null,
        video_url: readyVideo,
        image_done: imageDone,
      });
    }
    return out;
  }

  /** 单集详情（详情页标题/项目内其它信息用）。 */
  async getEpisode(episodeId: number) {
    const ep = await this.episodeRepo.findOne({ where: { id: episodeId } });
    if (!ep) throw new NotFoundException(`episode ${episodeId} not found`);
    const kfs = await this.keyframeRepo.find({ where: { episode_id: ep.id } });
    const video = await this.videoRepo.findOne({ where: { episode_id: ep.id } });
    return {
      episode_id: ep.id,
      project_id: ep.project_id,
      seq: ep.seq,
      title: ep.title,
      summary: ep.summary,
      seconds: ep.seconds,
      status: ep.status,
      segment_count: kfs.length,
      shot_count: kfs.reduce((s, k) => s + this.ensureShots(k).length, 0),
      total_seconds: kfs.reduce((s, k) => {
        const shots = this.ensureShots(k);
        return s + (shots.length ? shotsSeconds(shots) : k.seconds || 0);
      }, 0),
      video_url: video?.status === 'ready' ? video.url : null,
      video_status: video?.status ?? 'pending',
    };
  }

  // ---------- 分镜脚本生成（TC-SP / UT-BE-02） ----------
  async generateScript(
    episodeId: number,
    opts?: GenerateScriptDto,
  ): Promise<{ keyframes: number; shots: number }> {
    const ep = await this.episodeRepo.findOne({ where: { id: episodeId } });
    if (!ep) throw new NotFoundException(`episode ${episodeId} not found`);
    const project = await this.projectRepo.findOne({ where: { id: ep.project_id } });
    const assets = await this.assetRepo.find({ where: { project_id: ep.project_id } });
    const charNames = assets.filter((a) => a.type === 'character').map((a) => a.name);
    const sceneNames = assets.filter((a) => a.type === 'scene').map((a) => a.name);
    const propNames = assets.filter((a) => a.type === 'prop').map((a) => a.name);

    const shotCount = Math.min(opts?.shot_count ?? 8, 20);
    const prompt =
      `为以下短剧分集生成分镜脚本，严格按 JSON 输出 {"shots":[{"seq":0,"shot_type":"","camera":"","seconds":0,"visual_desc":"","dialogue":"","characters":[],"scenes":[],"props":[]}]}\n` +
      `集标题：${ep.title}\n简介：${ep.summary}\n目标时长：${ep.seconds}s\n` +
      `可用角色：${charNames.join('、') || '（无）'}\n可用场景：${sceneNames.join('、') || '（无）'}\n可用道具：${propNames.join('、') || '（无）'}\n` +
      `共需 ${shotCount} 个镜头，不要字幕与屏幕文字，保持统一风格。只输出 JSON。`;
    const system = '你是资深分镜导演，擅长把分集简介拆成可执行的镜头脚本。';

    this.bus.publish({
      projectId: ep.project_id, type: 'keyframe', refId: ep.id,
      message: `正在为「${ep.title}」生成分镜脚本（${shotCount} 镜头）…`, ts: Date.now(),
    });
    const res = await this.agnes.generateText(prompt, system);
    // Key 未配置属于部署问题：明确报错，不降级，避免用户拿到看似成功实则无意义的分镜
    if (res.error && this.isMissingKey(res.error)) {
      this.bus.publish({
        projectId: ep.project_id, type: 'done',
        message: ERR.MODEL_NOT_CONFIGURED.message, ts: Date.now(),
      });
      throw ERR.MODEL_NOT_CONFIGURED;
    }
    // 模型调用失败（限流/超时/5xx）：明确报错，绝不静默降级成占位分镜，
    // 否则用户看到「生成成功」却拿到一堆无意义占位镜头，属于伪装成功。
    if (res.error) {
      const err = new BizError(
        ERR.MODEL_CALL_FAILED.code,
        `${ERR.MODEL_CALL_FAILED.message}（${res.error}）`,
        ERR.MODEL_CALL_FAILED.httpStatus,
      );
      this.bus.publish({
        projectId: ep.project_id, type: 'done', message: err.message, ts: Date.now(),
      });
      throw err;
    }
    // 模型有返回但 JSON 不合规：降级占位脚本，保证链路可推进、可重做
    let parsed = parseScriptJson(res.content);
    if (!parsed) {
      this.logger.warn(`script json parse failed for ep ${episodeId}, fallback to placeholder`);
      parsed = this.fallbackScript(shotCount, charNames, sceneNames, ep.seconds);
    }

    // 落 keyframe 行（幂等：先清空该集旧片段）
    await this.keyframeRepo.delete({ episode_id: episodeId });
    const picked = parsed.slice(0, shotCount);
    // 每 SHOTS_PER_SEGMENT 个分镜归并成一个片段（设计稿：一个 Segment 内含若干分镜），
    // 否则一个镜头一个片段会让右栏被撑成一长串，和设计稿不一致。
    const groups = chunkShots(picked, SHOTS_PER_SEGMENT);
    const existingSeqs: number[] = [];
    for (let gi = 0; gi < groups.length; gi++) {
      const group = groups[gi];
      const seq = assignKeyframeSeq(existingSeqs);
      existingSeqs.push(seq);
      const shots = group.map((s) =>
        newShot({
          seconds: s.seconds,
          shot_size: s.shot_type,
          visual: s.visual_desc,
          camera: s.camera,
          sound: s.dialogue,
          caption: '',
        }),
      );
      const first = group[0];
      const chars = first ? this.matchIds(assets, 'character', first.characters) : [];
      const scns = first ? this.matchIds(assets, 'scene', first.scenes) : [];
      const props = first ? this.matchIds(assets, 'prop', first.props) : [];
      // 组内其余镜头引用的角色/场景也合并进来，避免片段只认第一个镜头
      for (const s of group.slice(1)) {
        for (const id of this.matchIds(assets, 'character', s.characters)) {
          if (!chars.includes(id)) chars.push(id);
        }
        for (const id of this.matchIds(assets, 'scene', s.scenes)) {
          if (!scns.includes(id)) scns.push(id);
        }
        for (const id of this.matchIds(assets, 'prop', s.props)) {
          if (!props.includes(id)) props.push(id);
        }
      }
      await this.keyframeRepo.save(
        this.keyframeRepo.create({
          episode_id: episodeId,
          seq,
          shot_type: first?.shot_type ?? '',
          camera: first?.camera ?? '',
          seconds: shotsSeconds(shots),
          // visual_desc / dialogue 保留为「片段级摘要」，兼容老的单镜头出图逻辑
          visual_desc: group.map((s) => s.visual_desc).filter(Boolean).join('\n'),
          dialogue: group.map((s) => s.dialogue).filter(Boolean).join('\n'),
          character_refs: JSON.stringify(chars),
          scene_refs: JSON.stringify(scns),
          prop_refs: JSON.stringify(props),
          shots: stringifyShots(shots),
          video_status: 'pending',
        }),
      );
    }
    await this.episodeRepo.update(episodeId, { status: 'ready' });
    this.bus.publish({
      projectId: ep.project_id, type: 'keyframe', refId: ep.id,
      message: `「${ep.title}」分镜脚本已生成：${groups.length} 个片段 / ${picked.length} 个分镜`, ts: Date.now(),
    });
    return { keyframes: groups.length, shots: picked.length };
  }

  // ---------- 镜头编辑 ----------
  async listKeyframes(episodeId: number) {
    const rows = await this.keyframeRepo.find({
      where: { episode_id: episodeId },
      order: { seq: 'ASC' },
    });
    return rows.map((k) => this.toKfView(k));
  }

  async editKeyframe(episodeId: number, keyframeId: number, dto: KeyframeDto) {
    const k = await this.keyframeRepo.findOne({ where: { id: keyframeId, episode_id: episodeId } });
    if (!k) throw new NotFoundException(`keyframe ${keyframeId} not found`);
    const patch: Record<string, unknown> = {};
    if (dto.shot_type !== undefined) patch.shot_type = dto.shot_type;
    if (dto.camera !== undefined) patch.camera = dto.camera;
    if (dto.seconds !== undefined) patch.seconds = dto.seconds;
    if (dto.visual_desc !== undefined) patch.visual_desc = dto.visual_desc;
    if (dto.dialogue !== undefined) patch.dialogue = dto.dialogue;
    await this.keyframeRepo.update(k.id, patch);
    return this.toKfView(await this.keyframeRepo.findOne({ where: { id: k.id } }));
  }

  async addKeyframe(episodeId: number, dto: AddKeyframeDto) {
    const existing = await this.keyframeRepo.find({ where: { episode_id: episodeId } });
    const seq = dto.seq ?? assignKeyframeSeq(existing.map((k) => k.seq));
    const shot = newShot({
      seconds: dto.shot?.seconds,
      shot_size: dto.shot?.shot_size,
      visual: dto.shot?.visual ?? dto.visual_desc ?? '',
      camera: dto.shot?.camera,
      sound: dto.shot?.sound ?? dto.dialogue ?? '',
      caption: dto.shot?.caption,
    });
    const k = await this.keyframeRepo.save(
      this.keyframeRepo.create({
        episode_id: episodeId,
        seq,
        shot_type: shot.shot_size,
        camera: shot.camera,
        seconds: shot.seconds,
        visual_desc: dto.visual_desc ?? shot.visual,
        dialogue: dto.dialogue ?? shot.sound,
        scene_setting: dto.scene_setting ?? null,
        shots: stringifyShots([shot]),
        video_status: 'pending',
      }),
    );
    // 插在指定片段之后：把该位置及其后的片段 seq 顺移
    if (dto.after_keyframe_id) {
      await this.shiftSeqAfter(episodeId, dto.after_keyframe_id, k.id);
    }
    return this.toKfView(await this.keyframeRepo.findOne({ where: { id: k.id } }));
  }

  /** 把 targetId 挪到 anchorId 之后，其余片段顺序不变。 */
  private async shiftSeqAfter(episodeId: number, anchorId: number, targetId: number) {
    const rows = await this.keyframeRepo.find({
      where: { episode_id: episodeId },
      order: { seq: 'ASC' },
    });
    const anchorIdx = rows.findIndex((r) => r.id === anchorId);
    const target = rows.find((r) => r.id === targetId);
    if (anchorIdx < 0 || !target) return;
    const others = rows.filter((r) => r.id !== targetId);
    others.splice(anchorIdx + 1, 0, target);
    await this.renumber(others);
  }

  /** 按数组顺序重排 seq 为 1..N。 */
  private async renumber(rows: Keyframe[]) {
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].seq !== i + 1) {
        await this.keyframeRepo.update(rows[i].id, { seq: i + 1 });
      }
    }
  }

  /** 片段内追加一个分镜。 */
  async addShot(episodeId: number, keyframeId: number, dto: AddShotDto) {
    const k = await this.keyframeRepo.findOne({ where: { id: keyframeId, episode_id: episodeId } });
    if (!k) throw new NotFoundException(`keyframe ${keyframeId} not found`);
    const list = this.ensureShots(k);
    const shot = newShot({
      seconds: dto.shot?.seconds,
      shot_size: dto.shot?.shot_size,
      visual: dto.shot?.visual,
      camera: dto.shot?.camera,
      sound: dto.shot?.sound,
      caption: dto.shot?.caption,
    });
    const at = dto.after_shot_id ? list.findIndex((s) => s.id === dto.after_shot_id) : -1;
    const next =
      at >= 0 ? [...list.slice(0, at + 1), shot, ...list.slice(at + 1)] : addShot(list, shot);
    await this.saveShots(k, next);
    return this.toKfView(await this.keyframeRepo.findOne({ where: { id: k.id } }));
  }

  /** 编辑片段内某个分镜。 */
  async editShot(
    episodeId: number,
    keyframeId: number,
    shotId: string,
    patch: Partial<SegmentShot>,
  ) {
    const k = await this.keyframeRepo.findOne({ where: { id: keyframeId, episode_id: episodeId } });
    if (!k) throw new NotFoundException(`keyframe ${keyframeId} not found`);
    const list = this.ensureShots(k);
    if (!list.some((s) => s.id === shotId)) {
      throw new NotFoundException(`shot ${shotId} not found`);
    }
    await this.saveShots(k, patchShot(list, shotId, patch));
    return this.toKfView(await this.keyframeRepo.findOne({ where: { id: k.id } }));
  }

  /** 删除片段内某个分镜（至少保留一个，避免片段空壳）。 */
  async removeShot(episodeId: number, keyframeId: number, shotId: string) {
    const k = await this.keyframeRepo.findOne({ where: { id: keyframeId, episode_id: episodeId } });
    if (!k) throw new NotFoundException(`keyframe ${keyframeId} not found`);
    const list = this.ensureShots(k);
    if (list.length <= 1) {
      throw new BizError(40001, '片段至少保留一个分镜', 400);
    }
    await this.saveShots(k, removeShot(list, shotId));
    return this.toKfView(await this.keyframeRepo.findOne({ where: { id: k.id } }));
  }

  /** 片段级编辑：场景设定 / 画面描述 / 分镜整体覆盖。 */
  async editSegment(episodeId: number, keyframeId: number, dto: EditSegmentDto) {
    const k = await this.keyframeRepo.findOne({ where: { id: keyframeId, episode_id: episodeId } });
    if (!k) throw new NotFoundException(`keyframe ${keyframeId} not found`);
    const patch: Record<string, unknown> = {};
    if (dto.scene_setting !== undefined) patch.scene_setting = dto.scene_setting;
    if (dto.visual_desc !== undefined) patch.visual_desc = dto.visual_desc;
    if (dto.shots) {
      const list = dto.shots.map((s) => newShot(s));
      patch.shots = stringifyShots(list);
      patch.seconds = shotsSeconds(list);
    }
    await this.keyframeRepo.update(k.id, patch);
    return this.toKfView(await this.keyframeRepo.findOne({ where: { id: k.id } }));
  }

  /** 重排片段顺序（seq 归一为 1..N）。 */
  async reorderSegments(episodeId: number, dto: ReorderSegmentsDto) {
    const rows = await this.keyframeRepo.find({ where: { episode_id: episodeId } });
    const byId = new Map(rows.map((r) => [r.id, r]));
    const ordered: Keyframe[] = [];
    for (const id of dto.keyframe_ids) {
      const r = byId.get(id);
      if (r && !ordered.includes(r)) ordered.push(r);
    }
    // 未列出的按原顺序补到末尾，保证不丢片段
    for (const r of rows.sort((a, b) => a.seq - b.seq)) {
      if (!ordered.includes(r)) ordered.push(r);
    }
    await this.renumber(ordered);
    return this.listKeyframes(episodeId);
  }

  /**
   * 写回分镜列表，并同步片段级冗余字段：
   * seconds = 分镜时长之和；visual_desc/dialogue 取首个分镜，供单镜头出图与老 UI 复用。
   */
  private async saveShots(k: Keyframe, list: SegmentShot[]) {
    const first = list[0];
    await this.keyframeRepo.update(k.id, {
      shots: stringifyShots(list),
      seconds: shotsSeconds(list),
      ...(first
        ? {
            shot_type: first.shot_size || k.shot_type,
            camera: first.camera || k.camera,
            visual_desc: list.map((s) => s.visual).filter(Boolean).join('\n') || k.visual_desc,
            dialogue: list.map((s) => s.sound).filter(Boolean).join('\n') || k.dialogue,
          }
        : {}),
    });
  }

  /**
   * 读出分镜：新数据读 shots 列；老数据（shots 为空）用 visual_desc/dialogue
   * 兜出一个分镜，保证详情页中栏永远有可编辑内容、不出现空卡片。
   */
  private ensureShots(k: Keyframe): SegmentShot[] {
    const list = parseShots(k.shots);
    if (list.length > 0) return list;
    if (!k.visual_desc && !k.dialogue && !k.seconds) return [];
    return [
      newShot({
        // 老数据用固定 id，保证多次读取 id 稳定（与资产形象踩过的坑同理）
        id: `seg-${k.id}-shot-1`,
        seconds: k.seconds || 4,
        shot_size: k.shot_type || '',
        visual: k.visual_desc || '',
        camera: k.camera || '',
        sound: k.dialogue || '',
      }),
    ];
  }

  async moveKeyframe(episodeId: number, keyframeId: number, dto: MoveKeyframeDto) {
    const k = await this.keyframeRepo.findOne({ where: { id: keyframeId, episode_id: episodeId } });
    if (!k) throw new NotFoundException(`keyframe ${keyframeId} not found`);
    await this.keyframeRepo.update(k.id, { seq: dto.seq });
    return this.toKfView(await this.keyframeRepo.findOne({ where: { id: k.id } }));
  }

  async removeKeyframe(episodeId: number, keyframeId: number) {
    const k = await this.keyframeRepo.findOne({ where: { id: keyframeId, episode_id: episodeId } });
    if (!k) return { deleted: false };
    await this.keyframeRepo.remove(k);
    // 删完把剩余片段 seq 归一为 1..N，避免详情页出现「Segment 1 / 3 / 7」的断号
    const rest = await this.keyframeRepo.find({
      where: { episode_id: episodeId },
      order: { seq: 'ASC' },
    });
    await this.renumber(rest);
    return { deleted: true };
  }

  /** 新增一集（分集列表「新增剧集」）。 */
  async createEpisode(projectId: number, dto: CreateEpisodeDto) {
    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    if (!project) throw new NotFoundException(`project ${projectId} not found`);
    const existing = await this.episodeRepo.find({ where: { project_id: projectId } });
    const seq = existing.length
      ? Math.max(...existing.map((e) => e.seq)) + 1
      : 1;
    const ep = await this.episodeRepo.save(
      this.episodeRepo.create({
        project_id: projectId,
        seq,
        title: dto.title?.trim() || `第${seq}集`,
        summary: dto.summary ?? '',
        seconds: dto.seconds ?? project.target_seconds ?? 90,
        status: 'draft',
      }),
    );
    this.bus.publish({
      projectId, type: 'keyframe', refId: ep.id,
      message: `已新增第 ${seq} 集「${ep.title}」`, ts: Date.now(),
    });
    return this.getEpisode(ep.id);
  }

  /** 删除一集（连带片段与成片）。 */
  async removeEpisode(projectId: number, episodeId: number) {
    const ep = await this.episodeRepo.findOne({ where: { id: episodeId, project_id: projectId } });
    if (!ep) throw new NotFoundException(`episode ${episodeId} not found`);
    await this.keyframeRepo.delete({ episode_id: episodeId });
    await this.videoRepo.delete({ episode_id: episodeId });
    await this.episodeRepo.remove(ep);
    // 剩余分集重排 seq，保证「第 N 集」连续
    const rest = await this.episodeRepo.find({
      where: { project_id: projectId },
      order: { seq: 'ASC' },
    });
    for (let i = 0; i < rest.length; i++) {
      if (rest[i].seq !== i + 1) await this.episodeRepo.update(rest[i].id, { seq: i + 1 });
    }
    return { deleted: true };
  }

  // ---------- 单镜头出图（关键帧 / 分镜画面）----------
  /**
   * 单镜头"生成"：用当前关键帧 prompt + 角色/场景参考出图。
   * @param kind keyframe=关键帧首帧图，shot=分镜画面尾帧图。
   * @param opts 生成面板下发的参数：size(1K/2K/4K)、风格后缀、自定义参考图、比例。
   */
  async generateKeyframeImage(
    episodeId: number,
    keyframeId: number,
    kind: 'keyframe' | 'shot',
    opts: GenerateImageDto = {},
  ) {
    const ep = await this.episodeRepo.findOne({ where: { id: episodeId } });
    const k = await this.keyframeRepo.findOne({ where: { id: keyframeId, episode_id: episodeId } });
    if (!ep || !k) throw new NotFoundException(`keyframe ${keyframeId} not found`);
    const assets = await this.assetRepo.find({ where: { project_id: ep.project_id } });
    // 面板里勾选的参考图优先；没勾就用片段绑定的角色/场景/道具
    const customRefs = (opts.ref_images || []).filter((u) => typeof u === 'string' && u.length > 0);
    const refImages = customRefs.length ? customRefs.slice(0, 5) : this.collectRefs(k, assets);
    const shots = this.ensureShots(k);

    this.bus.publish({
      projectId: ep.project_id, type: 'image', refId: k.id,
      message: `片段 ${k.seq} 正在出${kind === 'keyframe' ? '关键帧' : '分镜画面'}图…`, ts: Date.now(),
    });
    const prompt = [
      kind === 'keyframe' ? '关键帧' : '分镜画面',
      k.scene_setting ? `场景：${k.scene_setting}` : '',
      shots.length ? shots.map((s) => s.visual).filter(Boolean).join('；') : k.visual_desc || ep.title,
      shots[0]?.shot_size ? `景别：${shots[0].shot_size}` : k.shot_type ? `镜头：${k.shot_type}` : '',
      opts.style_prompt ? `风格：${opts.style_prompt}` : '',
      '无字幕，无屏幕文字，保持统一风格与场景背景',
    ].filter(Boolean).join('；');
    const params = buildImageParams(refImages, {
      ratio: normalizeRatio(opts.ratio, '16:9'),
      size: opts.size,
    });
    const result = await this.agnes.generateImage(prompt, {
      ratio: params.ratio,
      size: params.size,
      refImages: params.extra_body.image ?? [],
    });
    if (result.error) {
      await this.keyframeRepo.update(k.id, { error: result.error });
      this.bus.publish({
        projectId: ep.project_id, type: 'image', refId: k.id,
        message: `片段 ${k.seq} 出图失败：${result.error}`, ts: Date.now(),
      });
      return this.toKfView(await this.keyframeRepo.findOne({ where: { id: k.id } }));
    }
    const url = result.outUrl ?? result.outPath;
    const patch: Record<string, unknown> = { cost_ms: result.costMs, error: null };
    // 旧图不丢：压进历史记录，详情页右栏「历史记录」可回看
    const prev = kind === 'keyframe' ? k.keyframe_url : k.shot_image_url;
    if (prev && prev !== url) {
      patch.history = stringifyHistory(pushHistory(parseHistory(k.history), { kind, url: prev, ts: Date.now() }));
    }
    if (kind === 'keyframe') patch.keyframe_url = url;
    else patch.shot_image_url = url;
    await this.keyframeRepo.update(k.id, patch);
    this.bus.publish({
      projectId: ep.project_id, type: 'image', refId: k.id, outUrl: url,
      message: `片段 ${k.seq} ${kind === 'keyframe' ? '关键帧' : '分镜画面'}已出图 ✓（${result.costMs}ms）`, ts: Date.now(),
    });
    return this.toKfView(await this.keyframeRepo.findOne({ where: { id: k.id } }));
  }

  // ---------- 批量生成图片（并发池，TC-VD） ----------
  async batchGenerateImages(episodeId: number, kind: 'keyframe' | 'shot') {
    const ep = await this.episodeRepo.findOne({ where: { id: episodeId } });
    if (!ep) throw new NotFoundException(`episode ${episodeId} not found`);
    const kfs = await this.keyframeRepo.find({ where: { episode_id: episodeId }, order: { seq: 'ASC' } });
    const concurrency = this.config.get<AppConfig>('app').queue.imageConcurrency;
    const queue = [...kfs];
    const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
      while (queue.length > 0) {
        const kf = queue.shift();
        if (!kf) break;
        // 复用单镜头出图逻辑
        await this.generateKeyframeImage(episodeId, kf.id, kind);
      }
    });
    await Promise.all(workers);
    this.bus.publish({
      projectId: ep.project_id, type: 'image', refId: episodeId,
      message: `批量出图完成：${kfs.length} 镜头（${kind}）`, ts: Date.now(),
    });
    return { processed: kfs.length };
  }

  // ---------- 批量生成视频（TC-VD / 异步轮询） ----------
  async batchGenerateVideos(episodeId: number, opts?: BatchVideoDto) {
    const ep = await this.episodeRepo.findOne({ where: { id: episodeId } });
    if (!ep) throw new NotFoundException(`episode ${episodeId} not found`);
    const kfs = await this.keyframeRepo.find({ where: { episode_id: episodeId }, order: { seq: 'ASC' } });
    const maxKf = this.config.get('app').video.maxKeyframesPerEpisode;
    if (kfs.length > maxKf) {
      throw ERR.CONTENT_BLOCKED; // 语义：超限提示分段（TC-EP 异常）
    }
    const concurrency = this.config.get('app').queue.videoConcurrency;
    const seconds = opts?.seconds ?? 8;

    // 并发池 + 幂等（同 keyframe 未终态不重复建任务）
    const queue = [...kfs];
    const workers = Array.from({ length: Math.max(1, concurrency) }, async () => {
      while (queue.length > 0) {
        const kf = queue.shift();
        if (!kf) break;
        await this.generateVideoForKeyframe(kf.id, seconds, opts);
      }
    });
    await Promise.all(workers);
    this.bus.publish({
      projectId: ep.project_id, type: 'video', refId: episodeId,
      message: `批量视频任务已提交：${kfs.length} 镜头`, ts: Date.now(),
    });
    return { submitted: kfs.length };
  }

  /** 单镜头视频（幂等：已有未终态任务则复用）。 */
  async generateVideoForKeyframe(keyframeId: number, seconds = 8, opts: GenerateVideoDto = {}) {
    const kf = await this.keyframeRepo.findOne({ where: { id: keyframeId } });
    if (!kf) throw new NotFoundException(`keyframe ${keyframeId} not found`);
    const ep = await this.episodeRepo.findOne({ where: { id: kf.episode_id } });
    const projectId = ep?.project_id ?? 0;

    // 幂等：未终态任务不重复建
    const openTask = await this.taskRepo.findOne({
      where: { ref_type: 'keyframe', ref_id: keyframeId, type: 'video' },
      order: { id: 'DESC' },
    });
    if (openTask && ['pending', 'running'].includes(openTask.status)) {
      return { keyframeId, videoStatus: kf.video_status, reused: true };
    }

    // 关键帧首帧必填（PRD 前置：各镜头关键帧图已出）
    const firstFrame = kf.keyframe_url;
    const lastFrame = kf.shot_image_url;
    if (!firstFrame && !lastFrame) {
      await this.keyframeRepo.update(kf.id, { video_status: 'failed', error: 'no keyframe image' });
      this.bus.publish({
        projectId, type: 'video', refId: keyframeId,
        message: `镜头 #${kf.seq} 无关键帧图，视频任务失败`, ts: Date.now(),
      });
      return { keyframeId, videoStatus: 'failed', reused: false };
    }

    const task = await this.taskRepo.save(
      this.taskRepo.create({
        ref_type: 'keyframe',
        ref_id: keyframeId,
        type: 'video',
        status: 'running',
      }),
    );
    await this.keyframeRepo.update(kf.id, { video_status: 'running', error: null });
    this.bus.publish({
      projectId, type: 'video', refId: keyframeId,
      message: `镜头 #${kf.seq} 视频任务已建（video_id=${task.id}）`, ts: Date.now(),
    });

    const result = await this.videoQueue.run(
      keyframeId,
      {
        firstFrame,
        lastFrame,
        seconds,
        // 输出分辨率（720P / 1080P）与参考图由生成面板下发
        size: opts.size,
        images: (opts.ref_images || []).filter((u) => typeof u === 'string' && u.length > 0),
      },
      async (status, url, error) => {
        if (status === 'completed') {
          await this.keyframeRepo.update(kf.id, { video_url: url, video_status: 'completed' });
          await this.taskRepo.update(task.id, { status: 'completed', finished_at: new Date() });
          this.bus.publish({
            projectId, type: 'video', refId: keyframeId, outUrl: url,
            message: `镜头 #${kf.seq} 视频完成 ✓`, ts: Date.now(),
          });
        } else if (status === 'failed') {
          await this.keyframeRepo.update(kf.id, { video_status: 'failed', error });
          await this.taskRepo.update(task.id, { status: 'failed', error, finished_at: new Date() });
          this.bus.publish({
            projectId, type: 'video', refId: keyframeId,
            message: `镜头 #${kf.seq} 视频失败：${error}`, ts: Date.now(),
          });
        }
      },
    );

    return { keyframeId, videoStatus: result.status === 'completed' ? 'completed' : 'failed', reused: false };
  }

  /**
   * 单镜头视频（片段卡片上的「生成视频」按钮）。
   * 与批量唯一的差别是：只有目标片段参与，且幂等复用未终态任务。
   */
  async generateVideoForSegment(episodeId: number, keyframeId: number, opts: GenerateVideoDto = {}) {
    const kf = await this.keyframeRepo.findOne({ where: { id: keyframeId, episode_id: episodeId } });
    if (!kf) throw new NotFoundException(`keyframe ${keyframeId} not found`);
    const seconds = opts.seconds ?? Math.min(Math.max(kf.seconds || 8, 4), 12);
    return this.generateVideoForKeyframe(keyframeId, seconds, opts);
  }

  /** 查询视频进度（轮询兜底，TC-VD / SM-02）。 */
  async videoProgress(episodeId: number) {
    const kfs = await this.keyframeRepo.find({ where: { episode_id: episodeId } });
    const total = kfs.length;
    const completed = kfs.filter((k) => k.video_status === 'completed').length;
    const failed = kfs.filter((k) => k.video_status === 'failed').length;
    const running = total - completed - failed;
    return {
      total,
      completed,
      failed,
      running,
      all_done: total > 0 && completed + failed === total,
      all_completed: total > 0 && completed === total,
    };
  }

  // ---------- 生成最终视频（ffmpeg 拼接，TC-EP / SM-04） ----------
  async assembleEpisode(episodeId: number) {
    const ep = await this.episodeRepo.findOne({ where: { id: episodeId } });
    if (!ep) throw new NotFoundException(`episode ${episodeId} not found`);
    const kfs = await this.keyframeRepo.find({
      where: { episode_id: episodeId, video_status: 'completed' },
      order: { seq: 'ASC' },
    });
    const urls = kfs.map((k) => k.video_url).filter(Boolean);
    if (!urls.length) {
      await this.setEpisodeVideo(episodeId, 'failed', 'no completed video');
      return { status: 'failed', error: 'no completed video', url: null };
    }
    // 拼接幂等：ready 不重拼
    const existing = await this.videoRepo.findOne({ where: { episode_id: episodeId } });
    if (existing?.status === 'ready') {
      return { status: 'ready', url: existing.url, total_seconds: existing.total_seconds };
    }
    this.bus.publish({
      projectId: ep.project_id,
      type: 'splice', refId: episodeId,
      message: `正在拼接整集视频（${urls.length} 片段）…`, ts: Date.now(),
    });
    const result = await this.ffmpeg.assemble(episodeId, urls);
    if (result.error) {
      await this.setEpisodeVideo(episodeId, 'failed', result.error);
      this.bus.publish({
        projectId: ep.project_id,
        type: 'splice', refId: episodeId,
        message: `拼接失败：${result.error}`, ts: Date.now(),
      });
      throw ERR.FFMPEG_FAILED;
    }
    const totalSeconds = kfs.reduce((s, k) => s + (k.seconds || 0), 0);
    await this.setEpisodeVideo(episodeId, 'ready', null, result.outPath, totalSeconds);
    await this.episodeRepo.update(episodeId, { status: 'done' });
    this.bus.publish({
      projectId: ep.project_id,
      type: 'splice', refId: episodeId, outUrl: result.outPath,
      message: `整集视频拼接完成（${totalSeconds}s）✓`, ts: Date.now(),
    });
    return { status: 'ready', url: result.outPath, total_seconds: totalSeconds };
  }

  // ---------- 批量下载（TC-EP / SM-05） ----------
  async batchDownload(episodeId: number, dto: BatchDownloadDto) {
    const ep = await this.episodeRepo.findOne({ where: { id: episodeId } });
    if (!ep) throw new NotFoundException(`episode ${episodeId} not found`);
    const kfs = dto.keyframe_ids?.length
      ? await this.keyframeRepo.find({ where: { id: In(dto.keyframe_ids) } })
      : await this.keyframeRepo.find({ where: { episode_id: episodeId }, order: { seq: 'ASC' } });

    if (dto.kind === 'image') {
      const items = kfs
        .filter((k) => k.keyframe_url || k.shot_image_url)
        .map((k) => ({ keyframe_id: k.id, keyframe_url: k.keyframe_url, shot_image_url: k.shot_image_url }));
      return { kind: 'image', count: items.length, items };
    }
    if (dto.kind === 'video') {
      const items = kfs
        .filter((k) => k.video_url)
        .map((k) => ({ keyframe_id: k.id, url: k.video_url, seq: k.seq }));
      return { kind: 'video', count: items.length, items };
    }
    // episode：整集成片
    const ev = await this.videoRepo.findOne({ where: { episode_id: episodeId } });
    return {
      kind: 'episode',
      count: ev?.status === 'ready' ? 1 : 0,
      url: ev?.url ?? null,
      status: ev?.status ?? 'pending',
    };
  }

  // ---------- helpers ----------
  private async setEpisodeVideo(
    episodeId: number,
    status: string,
    error: string | null,
    url?: string,
    totalSeconds = 0,
  ) {
    const existing = await this.videoRepo.findOne({ where: { episode_id: episodeId } });
    if (existing) {
      await this.videoRepo.update(existing.id, { status, error, url, total_seconds: totalSeconds });
    } else {
      await this.videoRepo.save(
        this.videoRepo.create({ episode_id: episodeId, status, error, url, total_seconds: totalSeconds }),
      );
    }
  }

  private matchIds(assets: AssetItem[], type: string, names: string[]): number[] {
    const want = new Set(names.map((n) => n.trim().toLowerCase()).filter(Boolean));
    return assets.filter((a) => a.type === type && want.has(a.name.trim().toLowerCase())).map((a) => a.id);
  }

  private collectRefs(kf: Keyframe, assets: AssetItem[]): string[] {
    const charIds = this.parseRefs(kf.character_refs);
    const sceneIds = this.parseRefs(kf.scene_refs);
    const propIds = this.parseRefs(kf.prop_refs);
    const byId = new Map(assets.map((a) => [a.id, a]));
    const images = (ids: number[]) =>
      ids
        .map((id) => byId.get(id)?.base_image_url)
        .filter((u): u is string => !!u);
    return pickRefImages(images(charIds), images(sceneIds), images(propIds), 5);
  }

  private parseRefs(raw: string | null): number[] {
    if (!raw) return [];
    try {
      const v = JSON.parse(raw);
      return Array.isArray(v) ? v.map((x) => Number(x)).filter((n) => Number.isFinite(n)) : [];
    } catch {
      return [];
    }
  }

  /** 判断模型错误是否为「未配置 Key」：属部署问题，重试无意义。 */
  private isMissingKey(error: string): boolean {
    return /api[_-]?key\s*missing|api[_-]?key.*not\s*(set|configured)/i.test(error);
  }

  private fallbackScript(count: number, chars: string[], scenes: string[], totalSeconds: number) {
    const per = Math.max(2, Math.round(totalSeconds / Math.max(count, 1)));
    const base = { shot_type: '中景', camera: '固定', dialogue: '' };
    return Array.from({ length: count }, (_, i) => ({
      seq: i + 1,
      shot_type: base.shot_type,
      camera: base.camera,
      seconds: per,
      visual_desc: `第${i + 1}镜头（占位）：待补充画面描述`,
      dialogue: base.dialogue,
      characters: chars.slice(0, 2),
      scenes: scenes.slice(0, 1),
      props: [],
    }));
  }

  private toKfView(k: Keyframe) {
    const shots = this.ensureShots(k);
    return {
      id: k.id,
      episode_id: k.episode_id,
      seq: k.seq,
      shot_type: k.shot_type,
      camera: k.camera,
      seconds: shots.length ? shotsSeconds(shots) : k.seconds,
      visual_desc: k.visual_desc,
      dialogue: k.dialogue,
      scene_setting: k.scene_setting,
      shots,
      shot_count: shots.length,
      character_refs: this.parseRefs(k.character_refs),
      scene_refs: this.parseRefs(k.scene_refs),
      prop_refs: this.parseRefs(k.prop_refs),
      keyframe_url: k.keyframe_url,
      shot_image_url: k.shot_image_url,
      // 历史记录按类别分好，前端右栏两张卡片各取各的
      history: parseHistory(k.history),
      video_url: k.video_url,
      video_status: k.video_status,
      error: k.error,
    };
  }
}

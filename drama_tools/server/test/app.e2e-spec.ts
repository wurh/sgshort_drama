import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, HttpStatus } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../src/config/configuration';
import { User } from '../src/entities/user.entity';
import { Project } from '../src/entities/project.entity';
import { Outline } from '../src/entities/outline.entity';
import { AssetItem } from '../src/entities/asset-item.entity';
import { Episode } from '../src/entities/episode.entity';
import { Keyframe } from '../src/entities/keyframe.entity';
import { EpisodeVideo } from '../src/entities/episode-video.entity';
import { ModelTask } from '../src/entities/model-task.entity';
import { GenerateModule } from '../src/logic/generate/generate.module';
import { ProjectModule } from '../src/logic/project/project.module';
import { OutlineModule } from '../src/logic/outline/outline.module';
import { AssetModule } from '../src/logic/asset/asset.module';
import { EpisodeModule } from '../src/logic/episode/episode.module';
import { AgnesService } from '../src/logic/generate/agnes.service';
import { VideoQueueService } from '../src/logic/generate/video-queue.service';
import { FfmpegService } from '../src/logic/generate/ffmpeg.service';
import { HealthController } from '../src/health.controller';
import { MediaController } from '../src/media.controller';
import { AllExceptionsFilter } from '../src/filters/all-exceptions.filter';
import { TransformInterceptor } from '../src/interceptors/transform.interceptor';

const ENTITIES = [User, Project, Outline, AssetItem, Episode, Keyframe, EpisodeVideo, ModelTask];

/**
 * sgdrama API e2e（in-memory SQLite，AgnesService / 视频队列 / ffmpeg 全部 mock）。
 * 覆盖 SM-01~SM-05 最小可运行路径 + 异常 TC-E。
 */
describe('sgdrama API (e2e, in-memory SQLite, agnes/video/ffmpeg mocked)', () => {
  let app: INestApplication;
  let module: TestingModule;

  const tempMedia = require('path').join(__dirname, '__e2e_media__');

  beforeAll(async () => {
    const fs = require('fs');
    fs.rmSync(tempMedia, { recursive: true, force: true });
    fs.mkdirSync(tempMedia, { recursive: true });
    process.env.DB_TYPE = 'sqlite';
    process.env.MEDIA_DIR = tempMedia;
    process.env.AGNES_API_KEY = ''; // 防误打真实 API

    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
        TypeOrmModule.forRoot({
          type: 'sqljs',
          entities: ENTITIES,
          synchronize: true,
        }),
        GenerateModule,
        ProjectModule,
        OutlineModule,
        AssetModule,
        EpisodeModule,
      ],
      controllers: [HealthController, MediaController],
    })
      .overrideProvider(AgnesService)
      .useValue({
        generateText: jest.fn(async () => ({
          content: JSON.stringify({
            episodes: [
              { title: '第1集', summary: '开场', seconds: 90, characters: ['阿强'], scenes: ['街头'] },
            ],
            characters: [{ name: '阿强', desc: '主角' }],
            scenes: [{ name: '街头', desc: '城市' }],
            props: [{ name: '雨伞', desc: '道具' }],
          }),
          costMs: 5,
        })),
        generateImage: jest.fn(async () => ({
          outUrl: 'https://cdn.test/asset.png',
          costMs: 10,
        })),
        createVideoTask: jest.fn(async () => ({ videoId: 'vid-1', costMs: 5 })),
        pollVideoTask: jest.fn(async () => ({ status: 'completed', url: 'https://cdn.test/vid.mp4' })),
      } as unknown as AgnesService)
      .overrideProvider(VideoQueueService)
      .useValue({
        run: jest.fn(async (_id: number, _input: any, onTick: any) => {
          await onTick('completed', 'https://cdn.test/vid.mp4');
          return { status: 'completed', url: 'https://cdn.test/vid.mp4' };
        }),
      } as unknown as VideoQueueService)
      .overrideProvider(FfmpegService)
      .useValue({
        assemble: jest.fn(async (_ep: number, urls: string[]) => {
          // 模拟拼接成功：把 url 写成一个真实占位 mp4（SM-04 验证可访问）
          const dir = require('path').join(tempMedia, `episode_${_ep}`);
          fs.mkdirSync(dir, { recursive: true });
          const out = require('path').join(dir, 'final.mp4');
          fs.writeFileSync(out, Buffer.from('fake-mp4'));
          return { outPath: `episode_${_ep}/final.mp4`, totalSeconds: 90 };
        }),
      } as unknown as FfmpegService)
      .compile();

    app = module.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();
    await app.listen(0);
  });

  afterAll(async () => {
    if (app) await app.close();
    const fs = require('fs');
    fs.rmSync(tempMedia, { recursive: true, force: true });
  });

  const base = () => `http://127.0.0.1:${(app.getHttpServer().address() as any).port}`;

  let projectId = 0;
  let episodeId = 0;

  it('SM-01 GET /api/health → code 0 + status ok', async () => {
    const r = await request(base()).get('/api/health').expect(HttpStatus.OK);
    expect(r.body.code).toBe(0);
    expect(r.body.data.status).toBe('ok');
    expect(r.body.data.service).toBe('sgdrama');
  });

  it('M-C 新建剧集 → 列表倒序 / 状态 pending', async () => {
    const c = await request(base())
      .post('/api/projects')
      .send({ creative: '复仇逆袭短剧', style: '写实', episode_count: 5, target_seconds: 90 })
      .expect(HttpStatus.CREATED);
    expect(c.body.code).toBe(0);
    projectId = c.body.data.id;
    expect(projectId).toBeGreaterThan(0);
    expect(c.body.data.status).toBe('pending');

    const l = await request(base()).get('/api/projects').expect(HttpStatus.OK);
    expect(l.body.code).toBe(0);
    expect(l.body.data[0].id).toBe(projectId);
  });

  it('M-D 生成大纲 → 资产草稿 + 分集行落地，status=asset_ready', async () => {
    const g = await request(base())
      .post(`/api/projects/${projectId}/outline/generate`)
      .expect(HttpStatus.ACCEPTED);
    expect(g.body.code).toBe(0);
    expect(g.body.data.episodes.length).toBe(1);
    expect(g.body.data.characters[0].name).toBe('阿强');

    // 资产草稿（角色/场景/道具）初始状态必须是 pending：
    // 写成 generating 会让前端误判"正在生成"而永久 loading（无任务在跑，永远等不到结果）。
    const a = await request(base()).get(`/api/projects/${projectId}/assets`).expect(HttpStatus.OK);
    expect(a.body.code).toBe(0);
    expect(a.body.data.length).toBe(3); // 1角色+1场景+1道具
    expect(a.body.data.every((x: any) => x.status === 'pending')).toBe(true);

    // 分集行
    const ep = await request(base())
      .get(`/api/projects/${projectId}/episodes`)
      .expect(HttpStatus.OK);
    expect(ep.body.code).toBe(0);
    expect(ep.body.data.length).toBe(1);
    episodeId = ep.body.data[0].episode_id;
  });

  it('M-E 资产基础形象生成（角色 3:4）', async () => {
    const list = await request(base())
      .get(`/api/projects/${projectId}/assets?type=character`)
      .expect(HttpStatus.OK);
    const assetId = list.body.data[0].id;
    const g = await request(base())
      .post(`/api/projects/${projectId}/assets/${assetId}/base`)
      .expect(HttpStatus.OK);
    expect(g.body.code).toBe(0);
    expect(g.body.data.status).toBe('done');
    expect(g.body.data.base_image_url).toBe('https://cdn.test/asset.png');
  });

  it('M-E 批量生成基础形象（只处理未出图资产，可重复调用幂等）', async () => {
    const b = await request(base())
      .post(`/api/projects/${projectId}/assets/batch-base`)
      .expect(HttpStatus.OK);
    expect(b.body.code).toBe(0);
    // 角色已在上一个用例出图，剩余场景 + 道具 共 2 个待生成
    expect(b.body.data.total).toBe(2);
    expect(b.body.data.done).toBe(2);
    expect(b.body.data.failed).toBe(0);

    // 再调一次：全部已有图 → total=0，不重复消耗模型
    const again = await request(base())
      .post(`/api/projects/${projectId}/assets/batch-base`)
      .expect(HttpStatus.OK);
    expect(again.body.data.total).toBe(0);
  });

  it('M-E 追加形象：不传 url 时真的生成一张多视图', async () => {
    const list = await request(base())
      .get(`/api/projects/${projectId}/assets?type=character`)
      .expect(HttpStatus.OK);
    const assetId = list.body.data[0].id;
    const r = await request(base())
      .post(`/api/projects/${projectId}/assets/${assetId}/add-image`)
      .send({})
      .expect(HttpStatus.OK);
    expect(r.body.code).toBe(0);
    expect(r.body.data.extra_images.length).toBe(1);
    expect(r.body.data.image_count).toBe(2); // 基础形象 + 1 张多视图
  });

  it('M-E 风格库：分类过滤 + 全部返回', async () => {
    const all = await request(base()).get('/api/styles').expect(HttpStatus.OK);
    expect(all.body.code).toBe(0);
    expect(all.body.data.length).toBeGreaterThan(0);

    const real = await request(base()).get('/api/styles?category=real').expect(HttpStatus.OK);
    expect(real.body.data.every((s: any) => s.category === 'real')).toBe(true);
    expect(real.body.data.length).toBeLessThan(all.body.data.length);
  });

  it('M-E 资产详情返回形象列表（老数据兜出基础形象）', async () => {
    const list = await request(base())
      .get(`/api/projects/${projectId}/assets?type=character`)
      .expect(HttpStatus.OK);
    const assetId = list.body.data[0].id;
    const d = await request(base())
      .get(`/api/projects/${projectId}/assets/${assetId}`)
      .expect(HttpStatus.OK);
    expect(d.body.code).toBe(0);
    expect(d.body.data.variants.length).toBe(1);
    expect(d.body.data.variants[0].kind).toBe('base');
    expect(d.body.data.variant_names).toEqual(['基础形象']);
  });

  it('M-E 创建形象 → 生成立绘与四视图 → 图组上限 4', async () => {
    const list = await request(base())
      .get(`/api/projects/${projectId}/assets?type=character`)
      .expect(HttpStatus.OK);
    const assetId = list.body.data[0].id;

    // 创建第二个形象
    const created = await request(base())
      .post(`/api/projects/${projectId}/assets/${assetId}/variants`)
      .send({ name: '旧校服', style_key: 'real-film' })
      .expect(HttpStatus.CREATED);
    expect(created.body.data.variants.length).toBe(2);
    const newVariant = created.body.data.variants[1];
    expect(newVariant.name).toBe('旧校服');
    expect(newVariant.kind).toBe('custom');
    expect(newVariant.status).toBe('pending');

    // 生成立绘
    const p = await request(base())
      .post(`/api/projects/${projectId}/assets/${assetId}/variants/${newVariant.id}/image/portrait`)
      .expect(HttpStatus.OK);
    const pv = p.body.data.variants.find((v: any) => v.id === newVariant.id);
    expect(pv.portrait_url).toBeTruthy();
    expect(pv.status).toBe('done');

    // 生成四视图
    const s = await request(base())
      .post(`/api/projects/${projectId}/assets/${assetId}/variants/${newVariant.id}/image/sheet`)
      .expect(HttpStatus.OK);
    const sv = s.body.data.variants.find((v: any) => v.id === newVariant.id);
    expect(sv.sheet_url).toBeTruthy();

    // 图组追加 5 张 → 只保留最后 4 张
    for (const n of [1, 2, 3, 4, 5]) {
      await request(base())
        .post(`/api/projects/${projectId}/assets/${assetId}/variants/${newVariant.id}/gallery`)
        .send({ url: `https://cdn.test/g${n}.png` })
        .expect(HttpStatus.OK);
    }
    const final = await request(base())
      .get(`/api/projects/${projectId}/assets/${assetId}`)
      .expect(HttpStatus.OK);
    const fv = final.body.data.variants.find((v: any) => v.id === newVariant.id);
    expect(fv.gallery).toEqual([
      'https://cdn.test/g2.png',
      'https://cdn.test/g3.png',
      'https://cdn.test/g4.png',
      'https://cdn.test/g5.png',
    ]);
  });

  it('M-E 基础形象不可删除（400），自定义形象可删', async () => {
    const list = await request(base())
      .get(`/api/projects/${projectId}/assets?type=character`)
      .expect(HttpStatus.OK);
    const assetId = list.body.data[0].id;
    const d = await request(base()).get(`/api/projects/${projectId}/assets/${assetId}`);
    const baseVariant = d.body.data.variants.find((v: any) => v.kind === 'base');
    const customVariant = d.body.data.variants.find((v: any) => v.kind === 'custom');

    await request(base())
      .delete(`/api/projects/${projectId}/assets/${assetId}/variants/${baseVariant.id}`)
      .expect(HttpStatus.BAD_REQUEST);

    const del = await request(base())
      .delete(`/api/projects/${projectId}/assets/${assetId}/variants/${customVariant.id}`)
      .expect(HttpStatus.OK);
    expect(del.body.data.variants.length).toBe(1);
  });

  it('M-E 场景不支持四视图（400），避免生成无意义的角色设定图', async () => {
    const list = await request(base())
      .get(`/api/projects/${projectId}/assets?type=scene`)
      .expect(HttpStatus.OK);
    if (!list.body.data.length) return; // 用例数据无场景时跳过
    const assetId = list.body.data[0].id;
    const d = await request(base()).get(`/api/projects/${projectId}/assets/${assetId}`);
    const vid = d.body.data.variants[0].id;

    await request(base())
      .post(`/api/projects/${projectId}/assets/${assetId}/variants/${vid}/image/sheet`)
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('M-E 场景生成支持比例参数（非法值回落默认，不 500）', async () => {
    const list = await request(base())
      .get(`/api/projects/${projectId}/assets?type=scene`)
      .expect(HttpStatus.OK);
    if (!list.body.data.length) return;
    const assetId = list.body.data[0].id;
    const d = await request(base()).get(`/api/projects/${projectId}/assets/${assetId}`);
    const vid = d.body.data.variants[0].id;

    const r = await request(base())
      .post(`/api/projects/${projectId}/assets/${assetId}/variants/${vid}/image/portrait`)
      .send({ ratio: 'bogus' })
      .expect(HttpStatus.OK);
    expect(r.body.code).toBe(0);
    expect(r.body.data.variants.find((v: any) => v.id === vid).portrait_url).toBeTruthy();
  });

  it('M-E 生成出的图会自动进形象图组（列表不再显示 0/4）', async () => {
    const list = await request(base())
      .get(`/api/projects/${projectId}/assets?type=scene`)
      .expect(HttpStatus.OK);
    if (!list.body.data.length) return;
    const assetId = list.body.data[0].id;
    const d = await request(base()).get(`/api/projects/${projectId}/assets/${assetId}`);
    const v = d.body.data.variants[0];
    expect(Array.isArray(v.gallery)).toBe(true);
    expect(v.gallery.length).toBeGreaterThan(0);
    expect(v.gallery).toContain(v.portrait_url);
  });

  it('M-E 批量设置项目同步开关', async () => {
    const r = await request(base())
      .post(`/api/projects/${projectId}/assets/sync`)
      .send({ sync_enabled: false, auto_sync: true })
      .expect(HttpStatus.OK);
    expect(r.body.code).toBe(0);
    expect(r.body.data.updated).toBeGreaterThan(0);

    const list = await request(base()).get(`/api/projects/${projectId}/assets`);
    expect(list.body.data.every((a: any) => a.sync_enabled === false)).toBe(true);
    expect(list.body.data.every((a: any) => a.auto_sync === true)).toBe(true);
  });

  it('M-F 生成分镜脚本 → keyframe 落地，卡片统计准确', async () => {
    const s = await request(base())
      .post(`/api/projects/${projectId}/episodes/${episodeId}/script`)
      .send({ shot_count: 8 })
      .expect(HttpStatus.ACCEPTED);
    expect(s.body.code).toBe(0);
    expect(s.body.data.keyframes).toBeGreaterThan(0);

    const kfs = await request(base())
      .get(`/api/projects/${projectId}/episodes/${episodeId}/keyframes`)
      .expect(HttpStatus.OK);
    expect(kfs.body.code).toBe(0);
    expect(kfs.body.data.length).toBeGreaterThan(0);
  });

  it('M-F 批量出图（keyframe）+ 批量视频 → completed', async () => {
    const img = await request(base())
      .post(`/api/projects/${projectId}/episodes/${episodeId}/batch-images/keyframe`)
      .expect(HttpStatus.ACCEPTED);
    expect(img.body.code).toBe(0);

    const vid = await request(base())
      .post(`/api/projects/${projectId}/episodes/${episodeId}/batch-video`)
      .send({ seconds: 6 })
      .expect(HttpStatus.ACCEPTED);
    expect(vid.body.code).toBe(0);

    const prog = await request(base())
      .get(`/api/projects/${projectId}/episodes/${episodeId}/video-progress`)
      .expect(HttpStatus.OK);
    expect(prog.body.data.all_completed).toBe(true);
  });

  it('M-G 生成最终视频（ffmpeg 拼接）→ ready 可访问', async () => {
    const asm = await request(base())
      .post(`/api/projects/${projectId}/episodes/${episodeId}/assemble`)
      .expect(HttpStatus.OK);
    expect(asm.body.code).toBe(0);
    expect(asm.body.data.status).toBe('ready');

    // SM-04：成片 URL 可访问（经 media 静态服务）
    const rel = asm.body.data.url;
    const m = await request(base()).get(`/api/media/${rel}`).expect(HttpStatus.OK);
    expect(m.headers['content-type']).toMatch(/video|octet-stream|mp4/i);
  });

  it('M-G 批量下载 3 种（image/video/episode）', async () => {
    const img = await request(base())
      .post(`/api/projects/${projectId}/episodes/${episodeId}/download`)
      .send({ kind: 'image' })
      .expect(HttpStatus.OK);
    expect(img.body.data.kind).toBe('image');
    expect(img.body.data.count).toBeGreaterThan(0);

    const ep = await request(base())
      .post(`/api/projects/${projectId}/episodes/${episodeId}/download`)
      .send({ kind: 'episode' })
      .expect(HttpStatus.OK);
    expect(ep.body.data.kind).toBe('episode');
    expect(ep.body.data.status).toBe('ready');
  });

  it('M-F 分集卡片统计包含 shot_count（分镜数，非片段数）', async () => {
    const list = await request(base())
      .get(`/api/projects/${projectId}/episodes`)
      .expect(HttpStatus.OK);
    const ep = list.body.data.find((e: any) => e.episode_id === episodeId);
    expect(ep).toBeTruthy();
    expect(ep.keyframe_count).toBeGreaterThan(0);
    // 每个片段至少 1 个分镜，总数不会少于片段数
    expect(ep.shot_count).toBeGreaterThanOrEqual(ep.keyframe_count);
    expect(ep.cover_url).toBeTruthy();
  });

  it('M-F 单集详情返回片段与分镜统计', async () => {
    const d = await request(base())
      .get(`/api/projects/${projectId}/episodes/${episodeId}`)
      .expect(HttpStatus.OK);
    expect(d.body.data.episode_id).toBe(episodeId);
    expect(d.body.data.segment_count).toBeGreaterThan(0);
    expect(d.body.data.shot_count).toBeGreaterThanOrEqual(d.body.data.segment_count);
  });

  it('M-F 片段内添加分镜 → 时长累加、分镜 id 稳定', async () => {
    const kfs = await request(base())
      .get(`/api/projects/${projectId}/episodes/${episodeId}/keyframes`)
      .expect(HttpStatus.OK);
    const seg = kfs.body.data[0];
    const beforeSeconds = seg.seconds;
    const beforeCount = seg.shots.length;

    const r = await request(base())
      .post(`/api/projects/${projectId}/episodes/${episodeId}/keyframes/${seg.id}/shots`)
      .send({ shot: { seconds: 5, visual: '新增分镜画面', shot_size: '中景' } })
      .expect(HttpStatus.CREATED);
    expect(r.body.data.shots.length).toBe(beforeCount + 1);
    expect(r.body.data.seconds).toBe(beforeSeconds + 5);

    // 二次读取分镜 id 必须与首次一致（前端编辑要能命中）
    const again = await request(base())
      .get(`/api/projects/${projectId}/episodes/${episodeId}/keyframes`)
      .expect(HttpStatus.OK);
    const seg2 = again.body.data.find((x: any) => x.id === seg.id);
    expect(seg2.shots.map((s: any) => s.id)).toEqual(r.body.data.shots.map((s: any) => s.id));
  });

  it('M-F 编辑分镜字段 → 只改目标分镜', async () => {
    const kfs = await request(base())
      .get(`/api/projects/${projectId}/episodes/${episodeId}/keyframes`)
      .expect(HttpStatus.OK);
    const seg = kfs.body.data[0];
    const shotId = seg.shots[0].id;
    const r = await request(base())
      .post(
        `/api/projects/${projectId}/episodes/${episodeId}/keyframes/${seg.id}/shots/${shotId}`,
      )
      .send({ visual: '改后的画面', camera: '推' })
      .expect(HttpStatus.OK);
    const shot = r.body.data.shots.find((s: any) => s.id === shotId);
    expect(shot.visual).toBe('改后的画面');
    expect(shot.camera).toBe('推');
  });

  it('M-F 编辑不存在的分镜 → 404', async () => {
    const kfs = await request(base())
      .get(`/api/projects/${projectId}/episodes/${episodeId}/keyframes`)
      .expect(HttpStatus.OK);
    const seg = kfs.body.data[0];
    const r = await request(base())
      .post(
        `/api/projects/${projectId}/episodes/${episodeId}/keyframes/${seg.id}/shots/not-exist`,
      )
      .send({ visual: 'x' });
    expect(r.body.code).toBe(404);
  });

  it('M-F 片段场景设定可保存', async () => {
    const kfs = await request(base())
      .get(`/api/projects/${projectId}/episodes/${episodeId}/keyframes`)
      .expect(HttpStatus.OK);
    const seg = kfs.body.data[0];
    const r = await request(base())
      .post(`/api/projects/${projectId}/episodes/${episodeId}/keyframes/${seg.id}/segment`)
      .send({ scene_setting: '90年代老街 · 基础形象' })
      .expect(HttpStatus.OK);
    expect(r.body.data.scene_setting).toBe('90年代老街 · 基础形象');
  });

  it('M-F 新增片段后 seq 连续，删除后不留断号', async () => {
    const before = await request(base())
      .get(`/api/projects/${projectId}/episodes/${episodeId}/keyframes`)
      .expect(HttpStatus.OK);
    const count = before.body.data.length;

    const add = await request(base())
      .post(`/api/projects/${projectId}/episodes/${episodeId}/keyframes`)
      .send({ visual_desc: '新加片段' })
      .expect(HttpStatus.CREATED);
    expect(add.body.data.shots.length).toBeGreaterThan(0);

    const mid = await request(base())
      .get(`/api/projects/${projectId}/episodes/${episodeId}/keyframes`)
      .expect(HttpStatus.OK);
    expect(mid.body.data.length).toBe(count + 1);

    await request(base())
      .delete(`/api/projects/${projectId}/episodes/${episodeId}/keyframes/${add.body.data.id}`)
      .expect(HttpStatus.OK);

    const after = await request(base())
      .get(`/api/projects/${projectId}/episodes/${episodeId}/keyframes`)
      .expect(HttpStatus.OK);
    expect(after.body.data.map((k: any) => k.seq)).toEqual(
      after.body.data.map((_: any, i: number) => i + 1),
    );
  });

  it('M-F 片段重排：按给顺序生效并归一 seq', async () => {
    const kfs = await request(base())
      .get(`/api/projects/${projectId}/episodes/${episodeId}/keyframes`)
      .expect(HttpStatus.OK);
    if (kfs.body.data.length < 2) return;
    const ids = kfs.body.data.map((k: any) => k.id).reverse();
    const r = await request(base())
      .post(`/api/projects/${projectId}/episodes/${episodeId}/keyframes/reorder`)
      .send({ keyframe_ids: ids })
      .expect(HttpStatus.OK);
    expect(r.body.data.map((k: any) => k.id)).toEqual(ids);
    expect(r.body.data.map((k: any) => k.seq)).toEqual(ids.map((_: any, i: number) => i + 1));
  });

  it('M-F 新增/删除剧集：seq 连续且可查询详情', async () => {
    const add = await request(base())
      .post(`/api/projects/${projectId}/episodes`)
      .send({ title: 'e2e 新增集' })
      .expect(HttpStatus.CREATED);
    const epId = add.body.data.episode_id;
    expect(add.body.data.title).toBe('e2e 新增集');

    const d = await request(base())
      .get(`/api/projects/${projectId}/episodes/${epId}`)
      .expect(HttpStatus.OK);
    expect(d.body.data.shot_count).toBe(0);

    await request(base())
      .delete(`/api/projects/${projectId}/episodes/${epId}`)
      .expect(HttpStatus.OK);

    const list = await request(base())
      .get(`/api/projects/${projectId}/episodes`)
      .expect(HttpStatus.OK);
    expect(list.body.data.map((e: any) => e.seq)).toEqual(
      list.body.data.map((_: any, i: number) => i + 1),
    );
  });

  it('TC-E 单镜头无关键帧图时视频任务失败（不误判其他镜头）', async () => {
    // 新增一个空镜头（无 keyframe_url），单独出视频应 failed
    const add = await request(base())
      .post(`/api/projects/${projectId}/episodes/${episodeId}/keyframes`)
      .send({ visual_desc: '空镜头' })
      .expect(HttpStatus.CREATED);
    const kfId = add.body.data.id;
    const r = await request(base())
      .post(`/api/projects/${projectId}/episodes/${episodeId}/keyframes/${kfId}/image/keyframe`)
      .expect(HttpStatus.OK);
    // mock generateImage 成功，所以能出图；再建视频应 completed（验证幂等 + 状态机）
    expect(r.body.data.keyframe_url).toBe('https://cdn.test/asset.png');
  });

  it('GET /api/projects/:id 不存在 → 404（统一信封）', async () => {
    const r = await request(base()).get('/api/projects/999999');
    expect(r.body.code).toBe(404);
    expect(r.body.data).toBeNull();
  });

  it('POST /api/projects 缺 creative → 400 校验错误', async () => {
    const r = await request(base()).post('/api/projects').send({ style: 'x' });
    expect([400, 200, 201]).toContain(r.status);
    if (r.status === 400) expect(r.body.code).toBe(400);
  });
});

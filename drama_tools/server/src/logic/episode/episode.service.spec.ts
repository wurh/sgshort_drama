import { EpisodeService } from './episode.service';
import { ERR } from '../../common/errors';
import type { Repository } from 'typeorm';

/**
 * UT-BE-11 generateScript 失败语义（回归）：
 * 上游模型 429/超时 时必须显式报错，绝不能静默降级成占位分镜，
 * 否则用户看到「生成成功」却得到无意义占位内容（伪装成功）。
 */
describe('EpisodeService.generateScript 失败语义', () => {
  const episode = { id: 1, project_id: 3, title: '第一集', summary: '测试', seconds: 90 };

  const build = (agnesResult: { content: string; costMs: number; error?: string }) => {
    const episodeRepo = { findOne: jest.fn().mockResolvedValue(episode), update: jest.fn() } as unknown as Repository<any>;
    const keyframeRepo = {
      find: jest.fn().mockResolvedValue([]),
      delete: jest.fn(),
      save: jest.fn(),
      create: jest.fn((x) => x),
    } as unknown as Repository<any>;
    const assetRepo = { find: jest.fn().mockResolvedValue([]) } as unknown as Repository<any>;
    const projectRepo = { findOne: jest.fn().mockResolvedValue({ id: 3 }) } as unknown as Repository<any>;
    const agnes = { generateText: jest.fn().mockResolvedValue(agnesResult) };
    const bus = { publish: jest.fn(), finalize: jest.fn() };

    const svc = new EpisodeService(
      episodeRepo as any,
      keyframeRepo as any,
      {} as any,
      {} as any,
      assetRepo as any,
      projectRepo as any,
      agnes as any,
      bus as any,
      {} as any,
      {} as any,
      { get: jest.fn(() => ({ queue: { imageConcurrency: 1 }, video: { maxKeyframesPerEpisode: 20 } })) } as any,
    );
    return { svc, agnes, bus, keyframeRepo };
  };

  it('上游 429 限流：抛 502，不写占位镜头', async () => {
    const { svc, bus, keyframeRepo } = build({ content: '', costMs: 5, error: 'agnes llm 429' });

    await expect(svc.generateScript(1)).rejects.toMatchObject({
      code: ERR.MODEL_CALL_FAILED.code,
      httpStatus: 502,
    });
    // 关键：不能落任何占位镜头
    expect(keyframeRepo.save).not.toHaveBeenCalled();
    expect(keyframeRepo.delete).not.toHaveBeenCalled();
    // SSE 必须收到真实原因
    const doneEvt = bus.publish.mock.calls.map((c: any[]) => c[0]).find((e: any) => e.type === 'done');
    expect(doneEvt.message).toContain('429');
  });

  it('缺 Key：抛 503 MODEL_NOT_CONFIGURED', async () => {
    const { svc, keyframeRepo } = build({ content: '', costMs: 0, error: 'AGNES_API_KEY missing' });
    await expect(svc.generateScript(1)).rejects.toMatchObject({
      code: ERR.MODEL_NOT_CONFIGURED.code,
      httpStatus: 503,
    });
    expect(keyframeRepo.save).not.toHaveBeenCalled();
  });

  it('模型有返回但 JSON 不合规：降级占位脚本（链路可推进）', async () => {
    const { svc, keyframeRepo } = build({ content: '抱歉我无法输出 JSON', costMs: 900 });
    const r = await svc.generateScript(1, { shot_count: 3 });
    // 3 个占位分镜按每 2 个归并 → 2 个片段；分镜总数仍是 3
    expect(r.shots).toBe(3);
    expect(r.keyframes).toBe(2);
    expect(keyframeRepo.save).toHaveBeenCalledTimes(2);
  });
});
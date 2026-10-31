import { OutlineService } from './outline.service';
import { BizError, ERR } from '../../common/errors';
import type { Repository } from 'typeorm';

/**
 * UT-BE-10 OutlineService 失败语义：
 * - 缺 AGNES_API_KEY → 503 + 明确"未配置"，不谎报"创意太复杂"，且只调一次模型；
 * - 模型报错/JSON 解析失败 → 502 + 携带真实错误原因，且不落脏数据。
 */
describe('OutlineService 生成失败语义', () => {
  const project = {
    id: 3,
    creative: '都市逆袭',
    style: '都市',
    episode_count: 2,
    target_seconds: 60,
  };

  const build = (agnesResult: { content: string; costMs: number; error?: string }) => {
    const projectRepo = {
      findOne: jest.fn().mockResolvedValue(project),
      update: jest.fn().mockResolvedValue({}),
    } as unknown as Repository<any>;
    const outlineRepo = {
      delete: jest.fn(),
      save: jest.fn(),
      create: jest.fn((x) => x),
      findOne: jest.fn().mockResolvedValue(null),
    } as unknown as Repository<any>;
    const assetRepo = { find: jest.fn().mockResolvedValue([]), save: jest.fn() } as unknown as Repository<any>;
    const episodeRepo = { find: jest.fn().mockResolvedValue([]), save: jest.fn(), update: jest.fn() } as unknown as Repository<any>;
    const agnes = { generateText: jest.fn().mockResolvedValue(agnesResult) };
    const bus = { publish: jest.fn(), finalize: jest.fn() };
    const config = { get: jest.fn() };

    const svc = new OutlineService(
      outlineRepo as any,
      assetRepo as any,
      projectRepo as any,
      episodeRepo as any,
      agnes as any,
      bus as any,
      config as any,
    );
    return { svc, agnes, bus, outlineRepo, projectRepo };
  };

  it('缺 Key：抛 503 MODEL_NOT_CONFIGURED，只调用一次模型，不落大纲', async () => {
    const { svc, agnes, bus, outlineRepo } = build({
      content: '',
      costMs: 0,
      error: 'AGNES_API_KEY missing',
    });

    await expect(svc.generateOutline(3)).rejects.toMatchObject({
      code: ERR.MODEL_NOT_CONFIGURED.code,
      httpStatus: 503,
    });
    // 配置问题重试无意义，必须只调一次
    expect(agnes.generateText).toHaveBeenCalledTimes(1);
    // 不能写脏数据
    expect(outlineRepo.save).not.toHaveBeenCalled();
    expect(outlineRepo.delete).not.toHaveBeenCalled();
    // SSE done 事件必须是真实原因，而非"请简化创意"
    const doneEvt = bus.publish.mock.calls.map((c: any[]) => c[0]).find((e: any) => e.type === 'done');
    expect(doneEvt.message).toContain('AGNES_API_KEY');
    expect(doneEvt.message).not.toContain('简化创意');
    // 终态需关闭 SSE，否则前端一直挂着
    expect(bus.finalize).toHaveBeenCalledWith(3);
  });

  it('模型报错（非配置问题）：重试 2 次后抛 502 并携带真实原因', async () => {
    const { svc, agnes, outlineRepo } = build({
      content: '',
      costMs: 10,
      error: 'agnes llm 429',
    });

    await expect(svc.generateOutline(3)).rejects.toBeInstanceOf(BizError);
    expect(agnes.generateText).toHaveBeenCalledTimes(2);
    await svc.generateOutline(3).catch((e: BizError) => {
      expect(e.code).toBe(ERR.MODEL_BAD_OUTPUT.code);
      expect(e.httpStatus).toBe(502);
      expect(e.message).toContain('agnes llm 429');
    });
    expect(outlineRepo.save).not.toHaveBeenCalled();
  });

  it('模型正常但 JSON 不合规：抛 502 且提示解析失败', async () => {
    const { svc } = build({ content: '这不是 JSON', costMs: 10 });

    await expect(svc.generateOutline(3)).rejects.toMatchObject({
      code: ERR.MODEL_BAD_OUTPUT.code,
    });
  });
});
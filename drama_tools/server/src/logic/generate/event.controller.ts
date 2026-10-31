import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { Response } from 'express';
import { Subject } from 'rxjs';
import { EventBusService, GenEvent } from './event-bus.service';
import { NoEnvelope } from '../../decorators/no-envelope.decorator';
import { ProjectProgressService } from '../project/project-progress.service';

/** 终态集合：项目进入这些状态后关闭 SSE 流。 */
const TERMINAL = ['done', 'not_found'];

/**
 * SSE 端点：GET /api/projects/:id/events
 *
 * 连接流程（复刻 sghouse）：
 *  1. 设置 text/event-stream 响应头。
 *  2. 回放该项目已有日志（晚到页面也能看到已发生步骤）。
 *  3. 订阅实时事件流，逐条 res.write。
 *  4. 每 15s 发 :keepalive 保活。
 *  5. 每 5s 查项目进度，进入终态后写 done 帧并关闭；客户端断开清理所有定时器与订阅。
 */
@Controller('projects/:id/events')
export class EventController {
  constructor(
    private readonly bus: EventBusService,
    private readonly progress: ProjectProgressService,
  ) {}

  @NoEnvelope()
  @Get()
  async stream(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ): Promise<void> {
    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    (res as unknown as { flushHeaders?: () => void }).flushHeaders?.();

    const writeEvent = (evt: GenEvent) =>
      res.write(`event: ${evt.type}\ndata: ${JSON.stringify(evt)}\n\n`);
    const flush = () => (res as unknown as { flush?: () => void }).flush?.();

    // 2) 回放历史日志
    for (const evt of this.bus.replay(id)) writeEvent(evt);
    flush();

    // 3) 实时订阅
    const subject: Subject<GenEvent> = this.bus.subscribe(id);
    const sub = subject.subscribe((evt) => writeEvent(evt));

    // 4) 心跳
    const heartbeat = setInterval(() => res.write(':keepalive\n\n'), 15_000);

    // 5) 终态轮询
    const statusTimer = setInterval(() => {
      this.progress
        .progress(id)
        .then((p) => {
          if (TERMINAL.includes(p.status)) {
            writeEvent({
              projectId: id,
              type: 'done',
              message: p.status === 'done' ? '全部完成' : '已结束',
              percent: p.percent,
              ts: Date.now(),
            });
            cleanup();
          }
        })
        .catch(() => cleanup());
    }, 5000);

    const cleanup = () => {
      sub.unsubscribe();
      clearInterval(heartbeat);
      clearInterval(statusTimer);
      res.end();
    };

    res.on('close', cleanup);
  }
}

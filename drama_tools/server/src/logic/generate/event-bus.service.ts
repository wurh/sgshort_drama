import { Injectable, Logger } from '@nestjs/common';
import { Subject } from 'rxjs';

/**
 * 单条生成事件（SSE data，JSON 序列化）。按 projectId 隔离。
 * type 扩展：outline / asset / keyframe / video / splice / image / info / think / tool / done。
 */
export interface GenEvent {
  projectId: number;
  type:
    | 'info'
    | 'progress'
    | 'outline'
    | 'asset'
    | 'keyframe'
    | 'image'
    | 'video'
    | 'splice'
    | 'download'
    | 'think'
    | 'tool'
    | 'done';
  message: string;
  percent?: number;
  /** 关联实体 id（asset/keyframe 事件用）。 */
  refId?: number;
  /** 图片相对路径 / url（image 事件用，前端可即时展示）。 */
  outUrl?: string;
  /** think/tool 细分阶段。 */
  stage?: string;
  ts: number;
}

/**
 * 进程内事件总线：按 projectId 订阅，环形日志 50 条回放（复刻 sghouse EventBusService）。
 */
@Injectable()
export class EventBusService {
  private readonly logger = new Logger(EventBusService.name);
  private readonly subjects = new Map<number, Subject<GenEvent>>();
  private readonly logs = new Map<number, GenEvent[]>();
  private static readonly MAX_LOG = 50;

  constructor() {}

  publish(evt: GenEvent): void {
    const subject = this.subjects.get(evt.projectId);
    if (subject) subject.next(evt);
    const buf = this.logs.get(evt.projectId) ?? [];
    buf.push(evt);
    if (buf.length > EventBusService.MAX_LOG) buf.shift();
    this.logs.set(evt.projectId, buf);
    this.logger.debug(`[gen] project ${evt.projectId} ${evt.type}: ${evt.message}`);
  }

  subscribe(projectId: number): Subject<GenEvent> {
    let s = this.subjects.get(projectId);
    if (!s) {
      s = new Subject<GenEvent>();
      this.subjects.set(projectId, s);
    }
    return s;
  }

  replay(projectId: number): GenEvent[] {
    return [...(this.logs.get(projectId) ?? [])];
  }

  hasSubscribers(projectId: number): boolean {
    return this.subjects.has(projectId);
  }

  finalize(projectId: number): void {
    this.subjects.get(projectId)?.complete();
    this.subjects.delete(projectId);
  }
}

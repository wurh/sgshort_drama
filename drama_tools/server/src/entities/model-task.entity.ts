import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/** 模型任务（异步凭据：视频任务 video_id / 轮询状态 / 成本预留）。 */
@Entity({ name: 'sgdrama_model_task' })
export class ModelTask {
  @PrimaryGeneratedColumn()
  id: number;

  /** outline | asset_item | keyframe */
  @Index()
  @Column({ type: 'varchar', length: 16 })
  ref_type: string;

  @Index()
  @Column({ type: 'int' })
  ref_id: number;

  /** outline | image | video */
  @Column({ type: 'varchar', length: 16 })
  type: string;

  /** 视频任务远端 id（agnes video_id）。 */
  @Column({ type: 'varchar', length: 128, nullable: true })
  video_id: string;

  /** 幂等请求 id。 */
  @Column({ type: 'varchar', length: 128, nullable: true })
  request_id: string;

  /** pending | running | completed | failed */
  @Column({ type: 'varchar', length: 16, default: 'pending' })
  status: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  error: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'datetime', nullable: true })
  finished_at: Date;
}

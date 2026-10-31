import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/** 镜头 / 关键帧（复刻 sghouse rendered-image 状态机 + 视频状态机）。 */
@Entity({ name: 'sgdrama_keyframe' })
export class Keyframe {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int' })
  episode_id: number;

  /** 镜头序号（assignKeyframeSeq 分配，删除后复用最小空洞）。 */
  @Index()
  @Column({ type: 'int', default: 1 })
  seq: number;

  @Column({ type: 'varchar', length: 64, nullable: true })
  shot_type: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  camera: string;

  @Column({ type: 'int', default: 8 })
  seconds: number;

  @Column({ type: 'text', nullable: true })
  visual_desc: string;

  @Column({ type: 'text', nullable: true })
  dialogue: string;

  /** 引用的资产 id 数组（JSON）。 */
  @Column({ type: 'text', nullable: true })
  character_refs: string;
  @Column({ type: 'text', nullable: true })
  scene_refs: string;
  @Column({ type: 'text', nullable: true })
  prop_refs: string;

  /**
   * 片段内的分镜明细（JSON 数组）。
   * 一个片段（本行）对应设计稿的 Segment N，可含多个分镜；
   * 老数据为空时用 visual_desc/dialogue 兜出一个分镜，保证页面不空。
   */
  @Column({ type: 'text', nullable: true })
  shots: string;

  /** 本片段的主场景设定（设计稿「本镜头场景设定」）。 */
  @Column({ type: 'varchar', length: 128, nullable: true })
  scene_setting: string;

  /** 关键帧/分镜画面的历史图（JSON 数组，重新生成后旧图留档）。 */
  @Column({ type: 'text', nullable: true })
  history: string;

  /** 关键帧图 url。 */
  @Column({ type: 'varchar', length: 512, nullable: true })
  keyframe_url: string;

  /** 分镜画面图 url。 */
  @Column({ type: 'varchar', length: 512, nullable: true })
  shot_image_url: string;

  /** 镜头视频 url（视频任务 completed 后回填）。 */
  @Column({ type: 'varchar', length: 512, nullable: true })
  video_url: string;

  /** pending | running | completed | failed */
  @Column({ type: 'varchar', length: 16, default: 'pending' })
  video_status: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  error: string;

  @Column({ type: 'int', nullable: true })
  cost_ms: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

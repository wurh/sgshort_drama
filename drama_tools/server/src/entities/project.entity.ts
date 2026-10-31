import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * 剧集（项目管理）。
 * 状态机：pending → outline → done_outline → asset_ready → episode_ready → done
 */
@Entity({ name: 'sgdrama_project' })
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int', nullable: true })
  owner_id: number;

  @Column({ type: 'varchar', length: 128 })
  title: string;

  /** 一句创意 / 大纲描述。 */
  @Column({ type: 'text', nullable: true })
  creative: string;

  @Column({ type: 'varchar', length: 128, nullable: true })
  style: string;

  @Column({ type: 'int', default: 5 })
  episode_count: number;

  @Column({ type: 'int', default: 90 })
  target_seconds: number;

  /** pending | outline | done_outline | asset_ready | episode_ready | done */
  @Column({ type: 'varchar', length: 24, default: 'pending' })
  status: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  cover_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

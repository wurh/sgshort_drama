import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/** 整集成片（ffmpeg 拼接结果）。 */
@Entity({ name: 'sgdrama_episode_video' })
export class EpisodeVideo {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int' })
  episode_id: number;

  @Column({ type: 'varchar', length: 512, nullable: true })
  url: string;

  @Column({ type: 'int', default: 0 })
  total_seconds: number;

  /** pending | ready | failed */
  @Column({ type: 'varchar', length: 16, default: 'pending' })
  status: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  error: string;

  @CreateDateColumn()
  created_at: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/** 分集（步骤 3，含统计与状态机）。 */
@Entity({ name: 'sgdrama_episode' })
export class Episode {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int' })
  project_id: number;

  /** 集序号（1 起）。 */
  @Column({ type: 'int', default: 1 })
  seq: number;

  @Column({ type: 'varchar', length: 128, nullable: true })
  title: string;

  @Column({ type: 'text', nullable: true })
  summary: string;

  @Column({ type: 'int', default: 90 })
  seconds: number;

  /** draft | script | ready | rendering | done */
  @Column({ type: 'varchar', length: 16, default: 'draft' })
  status: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

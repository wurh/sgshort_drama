import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

/** 用户（本期最小化，仅登录态占位，无订阅/配额）。 */
@Entity({ name: 'sgdrama_user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 32, unique: true, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  nickname: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  avatar_url: string;

  @CreateDateColumn()
  created_at: Date;
}

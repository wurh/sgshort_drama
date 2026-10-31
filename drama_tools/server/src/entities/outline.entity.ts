import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

/** 剧本大纲（步骤 1 产物，Agnes-3.0-Flash 推理结果 + 资产草稿）。 */
@Entity({ name: 'sgdrama_outline' })
export class Outline {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int' })
  project_id: number;

  /** 分集数组 JSON：[{title, summary, seconds, characters[], scenes[]}] */
  @Column({ type: 'text', nullable: true })
  episodes_json: string;

  /** 角色草稿 JSON：[{name, desc, tags}] */
  @Column({ type: 'text', nullable: true })
  characters_json: string;

  /** 场景草稿 JSON：[{name, desc}] */
  @Column({ type: 'text', nullable: true })
  scenes_json: string;

  /** 道具草稿 JSON：[{name, desc}] */
  @Column({ type: 'text', nullable: true })
  props_json: string;

  @Column({ type: 'int', default: 1 })
  version: number;

  @CreateDateColumn()
  created_at: Date;
}

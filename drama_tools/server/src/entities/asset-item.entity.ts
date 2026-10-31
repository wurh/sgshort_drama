import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/**
 * 资产库（合并 角色/场景/道具，用 type 区分）。
 * 复刻 sghouse rendered-image 状态机（generating/done/failed + cost_ms + error）。
 */
@Entity({ name: 'sgdrama_asset_item' })
export class AssetItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int' })
  project_id: number;

  /** character | scene | prop */
  @Index()
  @Column({ type: 'varchar', length: 16 })
  type: string;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @Column({ type: 'text', nullable: true })
  desc: string;

  /** 基础形象 url。 */
  @Column({ type: 'varchar', length: 512, nullable: true })
  base_image_url: string;

  /** 多视图形象 url 数组（JSON）。 */
  @Column({ type: 'text', nullable: true })
  extra_images: string;

  /**
   * 形象列表（JSON，见 logic/asset/variants.ts）。
   * 一个资产可有多个形象，每个形象含竖版立绘 + 四视图 + 图组。
   * 为空时由 base_image_url 兜底出一个「基础形象」，保证老数据平滑升级。
   */
  @Column({ type: 'text', nullable: true })
  variants: string;

  /** generating | done | failed */
  @Column({ type: 'varchar', length: 16, default: 'generating' })
  status: string;

  /** 参考/引用信息（JSON）。 */
  @Column({ type: 'text', nullable: true })
  refs: string;

  /** 同步资产开关（是否注入剧本/分镜生成流程）。 */
  @Column({ type: 'boolean', default: true })
  sync_enabled: boolean;

  /** 自动同步开关。 */
  @Column({ type: 'boolean', default: false })
  auto_sync: boolean;

  @Column({ type: 'int', nullable: true })
  cost_ms: number;

  @Column({ type: 'varchar', length: 512, nullable: true })
  error: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

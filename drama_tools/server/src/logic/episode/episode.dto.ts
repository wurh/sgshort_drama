import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/** 编辑分镜脚本（画面描述/台词/角色/场景/道具）。 */
export class KeyframeDto {
  @ApiPropertyOptional({ description: '镜头类型' })
  @IsOptional()
  @IsString()
  shot_type?: string;

  @ApiPropertyOptional({ description: '机位' })
  @IsOptional()
  @IsString()
  camera?: string;

  @ApiPropertyOptional({ description: '镜头时长秒' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  seconds?: number;

  @ApiPropertyOptional({ description: '画面描述' })
  @IsOptional()
  @IsString()
  visual_desc?: string;

  @ApiPropertyOptional({ description: '台词' })
  @IsOptional()
  @IsString()
  dialogue?: string;
}

/** 片段内单个分镜。 */
export class SegmentShotDto {
  @ApiPropertyOptional({ description: '分镜 id（编辑/删除时必传）' })
  @IsOptional()
  @IsString()
  id?: string;

  @ApiPropertyOptional({ description: '时长秒' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(60)
  seconds?: number;

  @ApiPropertyOptional({ description: '景别' })
  @IsOptional()
  @IsString()
  shot_size?: string;

  @ApiPropertyOptional({ description: '画面' })
  @IsOptional()
  @IsString()
  visual?: string;

  @ApiPropertyOptional({ description: '运镜' })
  @IsOptional()
  @IsString()
  camera?: string;

  @ApiPropertyOptional({ description: '声音' })
  @IsOptional()
  @IsString()
  sound?: string;

  @ApiPropertyOptional({ description: '字幕 / 短句' })
  @IsOptional()
  @IsString()
  caption?: string;
}

/** 新增镜头（即新增一个片段）。 */
export class AddKeyframeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  visual_desc?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dialogue?: string;

  @ApiPropertyOptional({ description: '插入位置（seq，缺省追加末尾）' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  seq?: number;

  @ApiPropertyOptional({ description: '本片段场景设定' })
  @IsOptional()
  @IsString()
  scene_setting?: string;

  @ApiPropertyOptional({ description: '插入位置：在当前片段之后插入' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  after_keyframe_id?: number;

  @ApiPropertyOptional({ description: '初始分镜（不传则建一个空分镜）' })
  @IsOptional()
  @ValidateNested()
  @Type(() => SegmentShotDto)
  shot?: SegmentShotDto;
}

/** 向片段追加一个分镜。 */
export class AddShotDto {
  @ApiPropertyOptional({ description: '指定插入位置（分镜 id），缺省追加末尾' })
  @IsOptional()
  @IsString()
  after_shot_id?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => SegmentShotDto)
  shot?: SegmentShotDto;
}

/** 移动镜头。 */
export class MoveKeyframeDto {
  @ApiProperty({ description: '目标 seq' })
  @Type(() => Number)
  @IsInt()
  seq: number;
}

/** 生成分镜脚本选项。 */
export class GenerateScriptDto {
  @ApiPropertyOptional({ description: '镜头数（默认按大纲）' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  shot_count?: number;
}

/**
 * 分辨率档位（生成面板「输出设置」）。
 * 不做枚举强校验：前端历史数据/脏值不应导致 400，服务层统一回落默认档。
 */

/** 单镜头出图选项（生成图片面板）。 */
export class GenerateImageDto {
  @ApiPropertyOptional({ description: '输出分辨率 1K / 2K / 4K（缺省 1K）' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ description: '风格提示词（由风格库选中项透传，追加到 prompt）' })
  @IsOptional()
  @IsString()
  style_prompt?: string;

  @ApiPropertyOptional({ description: '自定义参考图 URL（覆盖按资产自动挑选）' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ref_images?: string[];

  @ApiPropertyOptional({ description: '画面比例，缺省按类型取 16:9' })
  @IsOptional()
  @IsString()
  ratio?: string;
}

/** 批量生成视频选项。 */
export class BatchVideoDto {
  @ApiPropertyOptional({ description: '镜头时长秒（4~12）' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(4)
  @Max(12)
  seconds?: number;

  @ApiPropertyOptional({ description: '输出分辨率 720p / 1080p（缺省 720p）' })
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ description: '风格提示词（展示/透传给下游任务）' })
  @IsOptional()
  @IsString()
  style_prompt?: string;

  @ApiPropertyOptional({ description: '参考图 URL（覆盖按资产自动挑选）' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ref_images?: string[];
}

/** 单镜头视频生成选项（镜头卡片上的「生成视频」）。 */
export class GenerateVideoDto extends BatchVideoDto {}

/** 批量下载选项。 */
export class BatchDownloadDto {
  @ApiProperty({ description: 'image | video | episode' })
  @IsString()
  kind: 'image' | 'video' | 'episode';

  @ApiPropertyOptional({ description: '指定 keyframe id（缺省全集）' })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  keyframe_ids?: number[];
}

/** 片段编辑（含场景设定与分镜整体覆盖）。 */
export class EditSegmentDto {
  @ApiPropertyOptional({ description: '场景设定' })
  @IsOptional()
  @IsString()
  scene_setting?: string;

  @ApiPropertyOptional({ description: '片段内单镜头出图使用的画面描述' })
  @IsOptional()
  @IsString()
  visual_desc?: string;

  @ApiPropertyOptional({ description: '整体覆盖分镜列表（回归/撤销用）' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SegmentShotDto)
  shots?: SegmentShotDto[];
}

/** 重排片段顺序。 */
export class ReorderSegmentsDto {
  @ApiProperty({ description: '按期望顺序排列的片段 id 数组' })
  @IsArray()
  @IsInt({ each: true })
  keyframe_ids: number[];
}

/** 新增一集。 */
export class CreateEpisodeDto {
  @ApiPropertyOptional({ description: '集标题（缺省「第N集」）' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '简介' })
  @IsOptional()
  @IsString()
  summary?: string;

  @ApiPropertyOptional({ description: '目标时长秒' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(5)
  @Max(600)
  seconds?: number;
}

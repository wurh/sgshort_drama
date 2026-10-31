import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

/** 新建剧集（项目管理，M-C / TC-PR）。 */
export class CreateProjectDto {
  @ApiProperty({ description: '一句话创意 / 大纲描述' })
  @IsString()
  @MinLength(2, { message: 'creative 至少 2 个字符' })
  creative: string;

  @ApiPropertyOptional({ description: '风格' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  style?: string;

  @ApiPropertyOptional({ description: '集数（1~20，默认 5）' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  episode_count?: number;

  @ApiPropertyOptional({ description: '每集目标时长秒（30~600，默认 90）' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(30)
  @Max(600)
  target_seconds?: number;

  @ApiPropertyOptional({ description: '标题（不传则用创意截取）' })
  @IsOptional()
  @IsString()
  title?: string;
}

import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { listStyles, StyleItem } from '../asset/styles';

/**
 * 风格库（全局资源，不依赖具体项目）。
 * 与 /projects/:pid/assets 分开挂载，避免用假 projectId 拼接。
 */
@ApiTags('style')
@Controller('styles')
export class StyleController {
  @Get()
  @ApiOperation({ summary: '风格库清单（category=all/2d/3d/real）' })
  list(@Query('category') category?: string): StyleItem[] {
    return listStyles(category);
  }
}
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { OutlineService, OutlineView } from './outline.service';
import { OutlineResult } from '../generate/types';

@ApiTags('outline')
@Controller('projects/:projectId/outline')
export class OutlineController {
  constructor(private readonly outlineService: OutlineService) {}

  @Get()
  @ApiOperation({ summary: '获取项目大纲（分集 + 角色/场景/道具草稿）' })
  view(@Param('projectId', ParseIntPipe) projectId: number): Promise<OutlineView | null> {
    return this.outlineService.view(projectId);
  }

  @Post('generate')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: '步骤 1 生成大纲（M-D / TC-OL / UT-BE-01）' })
  generate(@Param('projectId', ParseIntPipe) projectId: number): Promise<OutlineView> {
    return this.outlineService.generateOutline(projectId);
  }

  @Post('save')
  @ApiOperation({ summary: '编辑/保存大纲（改集/角色/场景/道具）' })
  save(@Param('projectId', ParseIntPipe) projectId: number, @Body() payload: OutlineResult) {
    return this.outlineService.save(projectId, payload);
  }
}

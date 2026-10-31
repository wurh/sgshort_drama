import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProjectService, ProjectView } from './project.service';
import { CreateProjectDto } from './project.dto';

@ApiTags('project')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: '剧集列表（按创建时间倒序）' })
  list(): Promise<ProjectView[]> {
    return this.projectService.list();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '新建剧集（项目管理 M-C / TC-PR）' })
  create(@Body() dto: CreateProjectDto): Promise<ProjectView> {
    return this.projectService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: '剧集详情' })
  detail(@Param('id', ParseIntPipe) id: number): Promise<ProjectView> {
    return this.projectService.detail(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除剧集（级联）' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectService.remove(id);
  }
}

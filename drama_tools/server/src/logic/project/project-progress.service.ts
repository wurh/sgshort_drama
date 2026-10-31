import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { Episode } from '../../entities/episode.entity';

export interface PipelineProgress {
  status: string;
  percent: number;
}

/**
 * 项目流水线进度（供 SSE 终态判定 + 轮询兜底）。
 * 终态集合：done / not_found。
 */
@Injectable()
export class ProjectProgressService {
  constructor(
    @InjectRepository(Project) private readonly projectRepo: Repository<Project>,
    @InjectRepository(Episode) private readonly episodeRepo: Repository<Episode>,
  ) {}

  async progress(projectId: number): Promise<PipelineProgress> {
    const project = await this.projectRepo.findOne({ where: { id: projectId } });
    if (!project) return { status: 'not_found', percent: 0 };
    const total = await this.episodeRepo.count({ where: { project_id: projectId } });
    const done = await this.episodeRepo.count({
      where: { project_id: projectId, status: 'done' },
    });
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    const status = project.status === 'done' ? 'done' : 'running';
    return { status, percent };
  }
}

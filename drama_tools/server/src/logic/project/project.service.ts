import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../../entities/project.entity';
import { Episode } from '../../entities/episode.entity';
import { CreateProjectDto } from './project.dto';

export interface ProjectView {
  id: number;
  title: string;
  creative: string | null;
  style: string | null;
  episode_count: number;
  target_seconds: number;
  status: string;
  cover_url: string | null;
  episode_count_actual: number;
  created_at: Date;
  updated_at: Date;
}

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    @InjectRepository(Project) private readonly repo: Repository<Project>,
    @InjectRepository(Episode) private readonly episodeRepo: Repository<Episode>,
  ) {}

  async list(): Promise<ProjectView[]> {
    const rows = await this.repo.find({ order: { created_at: 'DESC', id: 'DESC' } });
    return Promise.all(rows.map((p) => this.withCount(p)));
  }

  async detail(id: number): Promise<ProjectView> {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException(`project ${id} not found`);
    return this.withCount(p);
  }

  /** 新建剧集：落 project 行，初始 status=pending。 */
  async create(dto: CreateProjectDto): Promise<ProjectView> {
    const title = dto.title?.trim() || dto.creative.slice(0, 16) || '未命名剧集';
    const p = await this.repo.save(
      this.repo.create({
        title,
        creative: dto.creative,
        style: dto.style,
        episode_count: dto.episode_count ?? 5,
        target_seconds: dto.target_seconds ?? 90,
        status: 'pending',
        cover_url: null,
      }),
    );
    this.logger.log(`project ${p.id} created (episodes=${p.episode_count})`);
    return this.withCount(p);
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) return { deleted: false };
    await this.repo.remove(p);
    return { deleted: true };
  }

  async advanceStatus(id: number, status: string): Promise<void> {
    await this.repo.update(id, { status });
  }

  private async withCount(p: Project): Promise<ProjectView> {
    const episode_count_actual = await this.episodeRepo.count({
      where: { project_id: p.id },
    });
    return {
      id: p.id,
      title: p.title,
      creative: p.creative,
      style: p.style,
      episode_count: p.episode_count,
      target_seconds: p.target_seconds,
      status: p.status,
      cover_url: p.cover_url,
      episode_count_actual,
      created_at: p.created_at,
      updated_at: p.updated_at,
    };
  }
}

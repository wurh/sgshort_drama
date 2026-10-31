import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../entities/project.entity';
import { Episode } from '../../entities/episode.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { ProjectProgressService } from './project-progress.service';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Episode])],
  providers: [ProjectService, ProjectProgressService],
  controllers: [ProjectController],
  exports: [ProjectService, ProjectProgressService],
})
export class ProjectModule {}

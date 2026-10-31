import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Episode } from '../../entities/episode.entity';
import { Keyframe } from '../../entities/keyframe.entity';
import { EpisodeVideo } from '../../entities/episode-video.entity';
import { ModelTask } from '../../entities/model-task.entity';
import { AssetItem } from '../../entities/asset-item.entity';
import { Project } from '../../entities/project.entity';
import { EpisodeService } from './episode.service';
import { EpisodeController } from './episode.controller';
import { GenerateModule } from '../generate/generate.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Episode, Keyframe, EpisodeVideo, ModelTask, AssetItem, Project]),
    GenerateModule,
  ],
  providers: [EpisodeService],
  controllers: [EpisodeController],
  exports: [EpisodeService],
})
export class EpisodeModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outline } from '../../entities/outline.entity';
import { AssetItem } from '../../entities/asset-item.entity';
import { Project } from '../../entities/project.entity';
import { Episode } from '../../entities/episode.entity';
import { OutlineService } from './outline.service';
import { OutlineController } from './outline.controller';
import { GenerateModule } from '../generate/generate.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Outline, AssetItem, Project, Episode]),
    GenerateModule,
  ],
  providers: [OutlineService],
  controllers: [OutlineController],
  exports: [OutlineService],
})
export class OutlineModule {}

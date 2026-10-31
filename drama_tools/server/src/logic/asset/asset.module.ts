import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetItem } from '../../entities/asset-item.entity';
import { Project } from '../../entities/project.entity';
import { AssetService } from './asset.service';
import { AssetController } from './asset.controller';
import { StyleController } from './style.controller';
import { GenerateModule } from '../generate/generate.module';

@Module({
  imports: [TypeOrmModule.forFeature([AssetItem, Project]), GenerateModule],
  providers: [AssetService],
  controllers: [AssetController, StyleController],
  exports: [AssetService],
})
export class AssetModule {}

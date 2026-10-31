import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import configuration, { AppConfig } from './config/configuration';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { User } from './entities/user.entity';
import { Project } from './entities/project.entity';
import { Outline } from './entities/outline.entity';
import { AssetItem } from './entities/asset-item.entity';
import { Episode } from './entities/episode.entity';
import { Keyframe } from './entities/keyframe.entity';
import { EpisodeVideo } from './entities/episode-video.entity';
import { ModelTask } from './entities/model-task.entity';
import { GenerateModule } from './logic/generate/generate.module';
import { ProjectModule } from './logic/project/project.module';
import { OutlineModule } from './logic/outline/outline.module';
import { AssetModule } from './logic/asset/asset.module';
import { EpisodeModule } from './logic/episode/episode.module';
import { HealthController } from './health.controller';
import { MediaController } from './media.controller';

const ENTITIES = [User, Project, Outline, AssetItem, Episode, Keyframe, EpisodeVideo, ModelTask];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.env.local'],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        const app = config.get<AppConfig>('app');
        const db = app.db;
        const base = {
          entities: ENTITIES,
          // 开发/单测自动建表；生产用迁移（synchronize 仅在本地 sqlite 开启）
          synchronize: db.type === 'sqlite',
        };
        if (db.type === 'sqlite') {
          return {
            type: 'sqljs' as const,
            location: db.sqliteFile,
            autoSave: true,
            ...base,
          };
        }
        return {
          type: 'mysql' as const,
          host: db.host,
          port: db.port,
          username: db.username,
          password: db.password,
          database: db.database,
          ...base,
        };
      },
      inject: [ConfigService],
    }),
    GenerateModule,
    ProjectModule,
    OutlineModule,
    AssetModule,
    EpisodeModule,
  ],
  controllers: [HealthController, MediaController],
  providers: [{ provide: APP_FILTER, useClass: AllExceptionsFilter }],
})
export class AppModule {}

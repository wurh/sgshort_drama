import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { Outline } from '../entities/outline.entity';
import { AssetItem } from '../entities/asset-item.entity';
import { Episode } from '../entities/episode.entity';
import { Keyframe } from '../entities/keyframe.entity';
import { EpisodeVideo } from '../entities/episode-video.entity';
import { ModelTask } from '../entities/model-task.entity';

/** 迁移 CLI 数据源（ts-node 运行）。DB 走环境变量，默认 sqlite。 */
const ENTITIES = [User, Project, Outline, AssetItem, Episode, Keyframe, EpisodeVideo, ModelTask];

export default new DataSource(
  process.env.DB_TYPE === 'mysql'
    ? {
        type: 'mysql' as const,
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'sgdrama',
        entities: ENTITIES,
        migrations: ['src/migrations/*.ts'],
        synchronize: false,
      }
    : {
        type: 'sqljs' as const,
        location: process.env.DB_SQLITE_FILE || 'data/sgdrama.sqlite',
        autoSave: true,
        entities: ENTITIES,
        migrations: ['src/migrations/*.ts'],
        synchronize: false,
      },
);

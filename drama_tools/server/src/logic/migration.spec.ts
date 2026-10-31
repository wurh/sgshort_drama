/** UT-BE-09 迁移 / 建表（sql.js 真库）：8 表建表成功，关键列可空与默认值正确。 */
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { Project } from '../entities/project.entity';
import { Outline } from '../entities/outline.entity';
import { AssetItem } from '../entities/asset-item.entity';
import { Episode } from '../entities/episode.entity';
import { Keyframe } from '../entities/keyframe.entity';
import { EpisodeVideo } from '../entities/episode-video.entity';
import { ModelTask } from '../entities/model-task.entity';

describe('migration / schema (sql.js real DB)', () => {
  const ENTITIES = [User, Project, Outline, AssetItem, Episode, Keyframe, EpisodeVideo, ModelTask];

  it('synchronize 建 8 表，且关键默认值正确', async () => {
    const ds = new DataSource({
      type: 'sqljs',
      entities: ENTITIES,
      synchronize: true,
    });
    await ds.initialize();

    const tables = await ds.query(
      `SELECT name FROM sqlite_master WHERE type='table' AND name LIKE 'sgdrama_%' ORDER BY name`,
    );
    const names = (tables as Array<{ name: string }>).map((t) => t.name);
    expect(names).toContain('sgdrama_project');
    expect(names).toContain('sgdrama_asset_item');
    expect(names).toContain('sgdrama_keyframe');
    expect(names).toContain('sgdrama_episode_video');
    expect(names).toContain('sgdrama_model_task');
    expect(names).toContain('sgdrama_outline');
    expect(names).toContain('sgdrama_episode');
    expect(names).toContain('sgdrama_user');

    const p = await ds.getRepository(Project).save(
      ds.getRepository(Project).create({ title: 'T', creative: 'C', status: 'pending' }),
    );
    expect(p.episode_count).toBe(5);
    expect(p.target_seconds).toBe(90);
    expect(p.status).toBe('pending');

    const a = await ds.getRepository(AssetItem).save(
      ds
        .getRepository(AssetItem)
        .create({ project_id: 1, type: 'character', name: 'N', status: 'generating' }),
    );
    expect(a.sync_enabled).toBe(true);
    expect(a.auto_sync).toBe(false);

    const k = await ds.getRepository(Keyframe).save(
      ds.getRepository(Keyframe).create({ episode_id: 1, seq: 1, video_status: 'pending' }),
    );
    expect(k.seconds).toBe(8);

    await ds.destroy();
  }, 30000);
});
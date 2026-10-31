import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

/**
 * 集中式配置：全部来自环境变量，启动时集中解析、快速失败。
 * sgdrama 在 sghouse 基础上扩展：db.database='sgdrama'、agnes.videoModel、
 * videoPollIntervalMs、ffmpegBin、batchConcurrency。
 */
export interface AppConfig {
  env: string;
  port: number;
  db: {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    sqliteFile: string;
  };
  agnes: {
    baseUrl: string;
    apiKey: string;
    imageModel: string;
    textModel: string;
    videoModel: string;
    videoApiPath: string;
    timeoutMs: number;
  };
  video: {
    pollIntervalMs: number;
    pollTimeoutMs: number;
    secondsMin: number;
    secondsMax: number;
    maxKeyframesPerEpisode: number;
    ffmpegBin: string;
  };
  queue: {
    concurrency: number;
    videoConcurrency: number;
    imageConcurrency: number;
  };
  mediaDir: string;
}

export default registerAs('app', (): AppConfig => {
  const nodeEnv = process.env.NODE_ENV || 'local';
  const dbType =
    process.env.DB_TYPE || (nodeEnv === 'prod' || nodeEnv === 'dev' ? 'mysql' : 'sqlite');
  const mediaDir = process.env.MEDIA_DIR
    ? require('path').isAbsolute(process.env.MEDIA_DIR)
      ? process.env.MEDIA_DIR
      : join(process.cwd(), process.env.MEDIA_DIR)
    : join(process.cwd(), 'media');
  if (!existsSync(mediaDir)) {
    try {
      mkdirSync(mediaDir, { recursive: true });
    } catch {
      /* ignore */
    }
  }
  const dataDir = join(process.cwd(), 'data');
  if (!existsSync(dataDir)) {
    try {
      mkdirSync(dataDir, { recursive: true });
    } catch {
      /* ignore */
    }
  }

  return {
    env: nodeEnv,
    port: parseInt(process.env.PORT || '8730', 10),
    db: {
      type: dbType,
      host: process.env.DB_HOST || '127.0.0.1',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sgdrama',
      sqliteFile: join(dataDir, 'sgdrama.sqlite'),
    },
    agnes: {
      baseUrl: process.env.AGNES_BASE_URL || 'https://apihub.agnes-ai.com',
      apiKey: process.env.AGNES_API_KEY || '',
      imageModel: process.env.AGNES_IMAGE_MODEL || 'agnes-image-2.5-flash',
      textModel: process.env.AGNES_TEXT_MODEL || 'agnes-3.0-flash',
      videoModel: process.env.AGNES_VIDEO_MODEL || 'agnes-video-2.5-flash',
      videoApiPath: process.env.AGNES_VIDEO_API_PATH || '/agnesapi',
      timeoutMs: parseInt(process.env.AGNES_TIMEOUT_MS || '300000', 10),
    },
    video: {
      pollIntervalMs: parseInt(process.env.VIDEO_POLL_INTERVAL_MS || '1500', 10),
      pollTimeoutMs: parseInt(process.env.VIDEO_POLL_TIMEOUT_MS || '180000', 10),
      secondsMin: parseInt(process.env.VIDEO_SECONDS_MIN || '4', 10),
      secondsMax: parseInt(process.env.VIDEO_SECONDS_MAX || '12', 10),
      maxKeyframesPerEpisode: parseInt(process.env.MAX_KEYFRAMES_PER_EPISODE || '20', 10),
      ffmpegBin: process.env.FFMPEG_BIN || 'ffmpeg',
    },
    queue: {
      concurrency: Math.max(1, parseInt(process.env.QUEUE_CONCURRENCY || '2', 10)),
      videoConcurrency: Math.max(1, parseInt(process.env.VIDEO_CONCURRENCY || '3', 10)),
      imageConcurrency: Math.max(1, parseInt(process.env.IMAGE_CONCURRENCY || '5', 10)),
    },
    mediaDir,
  };
});

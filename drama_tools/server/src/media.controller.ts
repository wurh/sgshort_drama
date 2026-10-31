import {
  Controller,
  Get,
  Param,
  Res,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { join, normalize, resolve } from 'path';

/**
 * 媒体静态服务：/api/media/<project_x>/... 含路径穿越防护。
 * 关键：用 res.sendFile() 流式发送真实文件字节。
 */
@Controller('media')
export class MediaController {
  private readonly logger = new Logger(MediaController.name);
  constructor(private readonly config: ConfigService) {}

  @Get(':relpath(.*)')
  serve(@Param('relpath') relPath: string, @Res() res: Response) {
    const app = this.config.get<AppConfig>('app');
    const base = resolve(normalize(app.mediaDir));
    const target = normalize(join(base, relPath));
    if (!target.startsWith(base)) {
      this.logger.warn(`blocked path traversal: ${relPath}`);
      res.status(403).json({ code: 403, msg: 'forbidden', data: null });
      return;
    }
    if (!existsSync(target)) {
      res.status(404).json({ code: 404, msg: 'not found', data: null });
      return;
    }
    res.set('Cache-Control', 'public, max-age=3600');
    res.sendFile(target, (err) => {
      if (err) {
        this.logger.warn(`sendFile ${relPath} failed: ${(err as Error)?.message}`);
        if (!res.headersSent) {
          res.status(500).json({ code: 500, msg: String((err as Error)?.message ?? err), data: null });
        }
        res.end();
      }
    });
  }
}

// 局部类型别名，避免跨文件循环引用 AppConfig
type AppConfig = import('./config/configuration').AppConfig;

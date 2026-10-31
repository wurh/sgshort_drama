import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../config/configuration';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';

const execFileAsync = promisify(execFile);

/**
 * ffmpeg 串行拼接（避免并发资源争用，单集 ≤20 镜头限制由调用方保证）。
 * - 优先用输入文件清单 concat；若输入是远端 URL，先用 ffmpeg 直读 URL 亦可（ffmpeg 支持 https）。
 * - 拼接失败落 error，可单集重拼。
 */
@Injectable()
export class FfmpegService {
  private readonly logger = new Logger(FfmpegService.name);

  constructor(private readonly config: ConfigService) {}

  private bin(): string {
    return this.config.get<AppConfig>('app').video.ffmpegBin;
  }
  private mediaDir(): string {
    return this.config.get<AppConfig>('app').mediaDir;
  }

  /**
   * 按顺序把若干视频片段拼接为整集 mp4。
   * @returns 相对 media 的输出路径；失败返回 { error }。
   */
  async assemble(
    episodeId: number,
    videoUrls: string[],
  ): Promise<{ outPath?: string; totalSeconds?: number; error?: string }> {
    if (!videoUrls.length) {
      return { error: 'no video segments to assemble' };
    }
    const dir = join(this.mediaDir(), `episode_${episodeId}`);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    const outPath = join(dir, 'final.mp4');
    const rel = `episode_${episodeId}/final.mp4`;
    const listFile = join(dir, 'concat.txt');

    try {
      // 用 ffmpeg concat demuxer，逐行写入片段 URL（支持 https 远端）
      const lines = videoUrls.map((u) => `file '${u.replace(/'/g, "'\\''")}'`).join('\n');
      writeFileSync(listFile, lines);
      await execFileAsync(this.bin(), [
        '-y',
        '-f',
        'concat',
        '-safe',
        '0',
        '-i',
        listFile,
        '-c',
        'copy',
        outPath,
      ]);
      this.logger.log(`assembled episode ${episodeId} -> ${outPath}`);
      return { outPath: rel };
    } catch (e: any) {
      const msg = e?.message || String(e);
      this.logger.warn(`ffmpeg assemble episode ${episodeId} failed: ${msg}`);
      // 清理临时 list
      try {
        rmSync(listFile, { force: true });
      } catch {
        /* ignore */
      }
      return { error: `ffmpeg: ${msg}` };
    }
  }
}

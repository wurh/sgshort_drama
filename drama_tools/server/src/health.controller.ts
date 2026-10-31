import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from './config/configuration';

/**
 * 健康检查。除存活探针外，额外暴露「模型/ffmpeg 是否就绪」，
 * 让部署问题在调用生成接口前就能被发现，而不是等到 500 再翻日志。
 */
@Controller('health')
export class HealthController {
  constructor(private readonly config: ConfigService) {}

  @Get()
  check() {
    const cfg = this.config.get<AppConfig>('app');
    return {
      status: 'ok',
      service: 'sgdrama',
      version: '0.0.1',
      ts: new Date().toISOString(),
      readiness: {
        // 不泄露 Key 本身，仅告知是否已配置
        agnesKeyConfigured: Boolean(cfg?.agnes?.apiKey),
        textModel: cfg?.agnes?.textModel,
        imageModel: cfg?.agnes?.imageModel,
        videoModel: cfg?.agnes?.videoModel,
        ffmpegBin: cfg?.video?.ffmpegBin,
      },
    };
  }
}
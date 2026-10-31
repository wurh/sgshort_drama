import { Module } from '@nestjs/common';
import { AgnesService } from './agnes.service';
import { EventBusService } from './event-bus.service';
import { EventController } from './event.controller';
import { VideoQueueService } from './video-queue.service';
import { FfmpegService } from './ffmpeg.service';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [ProjectModule],
  providers: [AgnesService, EventBusService, VideoQueueService, FfmpegService],
  controllers: [EventController],
  exports: [AgnesService, EventBusService, VideoQueueService, FfmpegService],
})
export class GenerateModule {}

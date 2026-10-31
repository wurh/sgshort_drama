import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EpisodeService } from './episode.service';
import {
  KeyframeDto,
  AddKeyframeDto,
  MoveKeyframeDto,
  GenerateScriptDto,
  GenerateImageDto,
  GenerateVideoDto,
  BatchVideoDto,
  BatchDownloadDto,
  AddShotDto,
  EditSegmentDto,
  SegmentShotDto,
  ReorderSegmentsDto,
  CreateEpisodeDto,
} from './episode.dto';

@ApiTags('episode')
@Controller('projects/:projectId/episodes')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Get()
  @ApiOperation({ summary: '分集卡片统计（N角色｜N场景｜N镜头｜N秒）' })
  list(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.episodeService.listWithStats(projectId);
  }

  @Post(':episodeId/script')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: '步骤 3 生成分镜脚本（TC-SP / UT-BE-02）' })
  generateScript(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Body() dto: GenerateScriptDto,
  ) {
    return this.episodeService.generateScript(episodeId, dto);
  }

  @Get(':episodeId/keyframes')
  @ApiOperation({ summary: '镜头列表' })
  listKeyframes(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
  ) {
    return this.episodeService.listKeyframes(episodeId);
  }

  @Post(':episodeId/keyframes')
  @ApiOperation({ summary: '新增镜头' })
  addKeyframe(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Body() dto: AddKeyframeDto,
  ) {
    return this.episodeService.addKeyframe(episodeId, dto);
  }

  @Post(':episodeId/keyframes/reorder')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '按给定顺序重排片段' })
  reorder(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Body() dto: ReorderSegmentsDto,
  ) {
    return this.episodeService.reorderSegments(episodeId, dto);
  }

  @Post(':episodeId/keyframes/:keyframeId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '编辑镜头（画面描述/台词/角色/场景/道具）' })
  editKeyframe(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Param('keyframeId', ParseIntPipe) keyframeId: number,
    @Body() dto: KeyframeDto,
  ) {
    return this.episodeService.editKeyframe(episodeId, keyframeId, dto);
  }

  @Post(':episodeId/keyframes/:keyframeId/move')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '移动片段' })
  moveKeyframe(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Param('keyframeId', ParseIntPipe) keyframeId: number,
    @Body() dto: MoveKeyframeDto,
  ) {
    return this.episodeService.moveKeyframe(episodeId, keyframeId, dto);
  }

  @Post(':episodeId/keyframes/:keyframeId/segment')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '编辑片段（场景设定 / 画面描述 / 覆盖分镜）' })
  editSegment(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Param('keyframeId', ParseIntPipe) keyframeId: number,
    @Body() dto: EditSegmentDto,
  ) {
    return this.episodeService.editSegment(episodeId, keyframeId, dto);
  }

  @Post(':episodeId/keyframes/:keyframeId/shots')
  @ApiOperation({ summary: '片段内新增分镜' })
  addShot(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Param('keyframeId', ParseIntPipe) keyframeId: number,
    @Body() dto: AddShotDto,
  ) {
    return this.episodeService.addShot(episodeId, keyframeId, dto);
  }

  @Post(':episodeId/keyframes/:keyframeId/shots/:shotId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '编辑片段内分镜' })
  editShot(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Param('keyframeId', ParseIntPipe) keyframeId: number,
    @Param('shotId') shotId: string,
    @Body() dto: SegmentShotDto,
  ) {
    return this.episodeService.editShot(episodeId, keyframeId, shotId, dto);
  }

  @Delete(':episodeId/keyframes/:keyframeId/shots/:shotId')
  @ApiOperation({ summary: '删除片段内分镜' })
  removeShot(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Param('keyframeId', ParseIntPipe) keyframeId: number,
    @Param('shotId') shotId: string,
  ) {
    return this.episodeService.removeShot(episodeId, keyframeId, shotId);
  }

  @Get(':episodeId')
  @ApiOperation({ summary: '单集详情（标题/统计/成片）' })
  detail(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
  ) {
    return this.episodeService.getEpisode(episodeId);
  }

  @Post()
  @ApiOperation({ summary: '新增一集' })
  create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: CreateEpisodeDto,
  ) {
    return this.episodeService.createEpisode(projectId, dto);
  }

  @Delete(':episodeId')
  @ApiOperation({ summary: '删除一集（连带片段与成片）' })
  remove(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
  ) {
    return this.episodeService.removeEpisode(projectId, episodeId);
  }

  @Delete(':episodeId/keyframes/:keyframeId')
  @ApiOperation({ summary: '删除镜头' })
  removeKeyframe(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Param('keyframeId', ParseIntPipe) keyframeId: number,
  ) {
    return this.episodeService.removeKeyframe(episodeId, keyframeId);
  }

  @Post(':episodeId/keyframes/:keyframeId/image/:kind')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '单镜头出图（keyframe 关键帧 / shot 分镜画面）' })
  generateKeyframeImage(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Param('keyframeId', ParseIntPipe) keyframeId: number,
    @Param('kind') kind: 'keyframe' | 'shot',
    @Body() dto: GenerateImageDto,
  ) {
    return this.episodeService.generateKeyframeImage(episodeId, keyframeId, kind, dto);
  }

  @Post(':episodeId/keyframes/:keyframeId/video')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: '单镜头生成视频（生成视频面板：模型/风格/参考图/分辨率）' })
  generateKeyframeVideo(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Param('keyframeId', ParseIntPipe) keyframeId: number,
    @Body() dto: GenerateVideoDto,
  ) {
    return this.episodeService.generateVideoForSegment(episodeId, keyframeId, dto);
  }

  @Post(':episodeId/batch-images/:kind')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: '批量生成图片（并发池，TC-VD）' })
  batchGenerateImages(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Param('kind') kind: 'keyframe' | 'shot',
  ) {
    return this.episodeService.batchGenerateImages(episodeId, kind);
  }

  @Post(':episodeId/batch-video')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: '批量生成视频（keyframe 异步任务，TC-VD）' })
  batchGenerateVideos(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Body() dto: BatchVideoDto,
  ) {
    return this.episodeService.batchGenerateVideos(episodeId, dto);
  }

  @Get(':episodeId/video-progress')
  @ApiOperation({ summary: '视频任务进度（轮询兜底）' })
  videoProgress(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
  ) {
    return this.episodeService.videoProgress(episodeId);
  }

  @Post(':episodeId/assemble')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '生成最终视频（ffmpeg 拼接，TC-EP / SM-04）' })
  assemble(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
  ) {
    return this.episodeService.assembleEpisode(episodeId);
  }

  @Post(':episodeId/download')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '批量下载（image/video/episode，TC-EP / SM-05）' })
  download(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('episodeId', ParseIntPipe) episodeId: number,
    @Body() dto: BatchDownloadDto,
  ) {
    return this.episodeService.batchDownload(episodeId, dto);
  }
}

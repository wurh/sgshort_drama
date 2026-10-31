import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AssetService, AssetView, CreateAssetDto } from './asset.service';
import { listStyles, StyleItem } from './styles';

@ApiTags('asset')
@Controller('projects/:projectId/assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Get()
  @ApiOperation({ summary: '资产列表（按 type 过滤：character/scene/prop）' })
  list(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Query('type') type?: string,
  ): Promise<AssetView[]> {
    return this.assetService.list(projectId, type);
  }

  @Post()
  @ApiOperation({ summary: '新建资产（角色/场景/道具）' })
  create(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() dto: CreateAssetDto,
  ): Promise<AssetView> {
    return this.assetService.create(projectId, dto);
  }

  // ---------- 风格库 ----------
  // 注意：必须放在 :assetId 之前，否则 styles 会被当成 assetId 走 ParseIntPipe 报错。
  @Get('styles')
  @ApiOperation({ summary: '风格库清单（category=all/2d/3d/real）' })
  styles(@Query('category') category?: string): StyleItem[] {
    return listStyles(category);
  }

  @Post('batch-base')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '批量生成基础形象（仅处理尚未出图的资产，可按 type 过滤）' })
  batchBase(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: { type?: string },
  ): Promise<{ total: number; done: number; failed: number }> {
    return this.assetService.batchGenerateBase(projectId, body?.type);
  }

  /** 顶部「同步资产 / 自动同步」批量开关（整个项目）。 */
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '批量设置项目内所有资产的同步开关' })
  syncAll(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Body() body: { sync_enabled?: boolean; auto_sync?: boolean },
  ): Promise<{ updated: number }> {
    return this.assetService.setProjectSync(projectId, body ?? {});
  }

  @Get(':assetId')
  @ApiOperation({ summary: '资产详情（含全部形象）' })
  detail(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('assetId', ParseIntPipe) assetId: number,
  ): Promise<AssetView> {
    return this.assetService.getOne(projectId, assetId);
  }

  @Post(':assetId/base')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '生成资产基础形象（文生图，角色 3:4 / 场景道具 16:9）' })
  generateBase(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('assetId', ParseIntPipe) assetId: number,
  ): Promise<AssetView> {
    return this.assetService.generateBase(projectId, assetId);
  }

  // ---------- 形象（variant） ----------

  @Post(':assetId/variants')
  @ApiOperation({ summary: '新建形象（详情页「+ 添加 → 创建新形象」）' })
  createVariant(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('assetId', ParseIntPipe) assetId: number,
    @Body() body: { name?: string; desc?: string; style_key?: string },
  ): Promise<AssetView> {
    return this.assetService.createVariant(projectId, assetId, body ?? {});
  }

  @Post(':assetId/variants/:variantId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '更新形象（名称/描述/风格/应用到所有形象）' })
  updateVariant(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('assetId', ParseIntPipe) assetId: number,
    @Param('variantId') variantId: string,
    @Body() body: Record<string, unknown>,
  ): Promise<AssetView> {
    return this.assetService.updateVariant(projectId, assetId, variantId, body ?? {});
  }

  @Delete(':assetId/variants/:variantId')
  @ApiOperation({ summary: '删除形象（基础形象不可删）' })
  deleteVariant(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('assetId', ParseIntPipe) assetId: number,
    @Param('variantId') variantId: string,
  ): Promise<AssetView> {
    return this.assetService.deleteVariant(projectId, assetId, variantId);
  }

  @Post(':assetId/variants/:variantId/image/:kind')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '生成形象图片（kind=portrait 主图 / sheet 四视图，仅角色）' })
  generateVariantImage(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('assetId', ParseIntPipe) assetId: number,
    @Param('variantId') variantId: string,
    @Param('kind') kind: 'portrait' | 'sheet',
    @Body() body: { ratio?: string },
  ): Promise<AssetView> {
    return this.assetService.generateVariantImage(
      projectId,
      assetId,
      variantId,
      kind,
      body?.ratio,
    );
  }

  @Post(':assetId/variants/:variantId/gallery')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '向形象图组追加一张图（上限 4）' })
  addGallery(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('assetId', ParseIntPipe) assetId: number,
    @Param('variantId') variantId: string,
    @Body() body: { url?: string },
  ): Promise<AssetView> {
    return this.assetService.addVariantGallery(projectId, assetId, variantId, body?.url);
  }

  @Post(':assetId/add-image')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '添加形象（多视图追加，兼容旧接口）' })
  addImage(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('assetId', ParseIntPipe) assetId: number,
    @Body() body: { url?: string },
  ): Promise<AssetView> {
    return this.assetService.addImage(projectId, assetId, body?.url);
  }

  @Post(':assetId/sync')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '同步资产 / 自动同步开关' })
  toggleSync(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('assetId', ParseIntPipe) assetId: number,
    @Body() body: { sync: boolean; auto?: boolean },
  ): Promise<AssetView> {
    return this.assetService.toggleSync(projectId, assetId, body?.sync, body?.auto);
  }

  @Delete(':assetId')
  @ApiOperation({ summary: '删除资产（软删保护）' })
  remove(
    @Param('projectId', ParseIntPipe) projectId: number,
    @Param('assetId', ParseIntPipe) assetId: number,
  ) {
    return this.assetService.remove(projectId, assetId);
  }
}
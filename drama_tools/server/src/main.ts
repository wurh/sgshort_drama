import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
import { AppConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get(ConfigService);
  const appConfig = configService.get<AppConfig>('app');

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: false }),
  );
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new AllExceptionsFilter());

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('sgdrama API')
    .setDescription('Pavo 类 AI 短剧生成平台 v0.0.1（项目管理/剧本大纲/资产库/分集视频）')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = appConfig?.port ?? 8730;
  // 全部路由统一挂在 /api 下（含媒体 /api/media/... 与 SSE /api/projects/:id/events）。
  app.setGlobalPrefix('api');
  await app.listen(port);
  Logger.log(`sgdrama server running on http://localhost:${port} (env=${appConfig?.env})`, 'Bootstrap');
}
void bootstrap();

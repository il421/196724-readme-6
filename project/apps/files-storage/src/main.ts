/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { buildSwagger, GLOBAL_PREFIX, SWAGGER_TAGS } from '@project/core';
import { ConfigService } from '@nestjs/config';
import { FilesStorageModule } from './app/files-storage.module';

async function bootstrap() {
  const app = await NestFactory.create(FilesStorageModule);
  const configService = app.get(ConfigService);
  const port = configService.get('application.port');
  const host = configService.get('application.host');
  app.setGlobalPrefix(GLOBAL_PREFIX);
  buildSwagger(app, SWAGGER_TAGS.FILES);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://${host}:${port}/${GLOBAL_PREFIX}`
  );
}

bootstrap();

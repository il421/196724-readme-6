/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { PostModule } from './app/post.module';
import { buildSwagger, GLOBAL_PREFIX, SwaggerTags } from '@project/core';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(PostModule);
  const configService = app.get(ConfigService);
  const port = configService.get('application.port');
  buildSwagger(app, SwaggerTags.Posts);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`
  );
}

bootstrap();

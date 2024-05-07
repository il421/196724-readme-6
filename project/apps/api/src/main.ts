/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ApiModule } from './app/api.module';
import { buildSwagger, GLOBAL_PREFIX, SWAGGER_TAGS } from '@project/core';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.setGlobalPrefix(GLOBAL_PREFIX);
  buildSwagger(app, SWAGGER_TAGS.GATEWAY_API);
  const configService = app.get(ConfigService);
  const port = configService.get('application.port');

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`
  );
}

bootstrap();

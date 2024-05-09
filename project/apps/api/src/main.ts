/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ApiModule } from './app/api.module';
import { buildSwagger, GLOBAL_PREFIX, SWAGGER_TAGS } from '@project/core';
import { ConfigService } from '@nestjs/config';
import { RequestIdInterceptor } from '@project/interceptors-lib';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.useGlobalInterceptors(new RequestIdInterceptor());
  buildSwagger(app, SWAGGER_TAGS.GATEWAY_API);
  const configService = app.get(ConfigService);
  const port = configService.get('application.port');
  const host = configService.get('application.host');

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://${host}:${port}/${GLOBAL_PREFIX}`
  );
}

bootstrap();

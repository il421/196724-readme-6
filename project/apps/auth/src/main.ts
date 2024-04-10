/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { buildSwagger, GLOBAL_PREFIX, SwaggerTags } from '@project/core';
import { ConfigService } from '@nestjs/config';
import { AuthenticationModule } from './app/authentication.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthenticationModule);
  const configService = app.get(ConfigService);
  const port = configService.get('application.port');
  app.setGlobalPrefix(GLOBAL_PREFIX);
  buildSwagger(app, SwaggerTags.Auth);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`
  );
}

bootstrap();

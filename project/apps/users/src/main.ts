/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { UsersModule } from './app/users.module';
import { ConfigService } from '@nestjs/config';
import { buildSwagger, GLOBAL_PREFIX, SwaggerTags } from '@project/core';

async function bootstrap() {
  const app = await NestFactory.create(UsersModule);
  app.setGlobalPrefix(GLOBAL_PREFIX);
  const configService = app.get(ConfigService);
  const port = configService.get('application.port');
  buildSwagger(app, SwaggerTags.Users);
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${GLOBAL_PREFIX}`
  );
}

bootstrap();

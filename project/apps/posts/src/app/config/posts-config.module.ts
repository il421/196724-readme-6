import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { applicationConfig, jwtConfig, rabbitConfig } from '@project/core';
const ENV_FEEDBACK_FILE_PATH = 'apps/posts/.env';
const ENV_AUTH_FILE_PATH = 'apps/.env';
const ENV_NOTIFY_FILE_PATH = 'apps/notify/.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, jwtConfig, rabbitConfig],
      envFilePath: [
        ENV_FEEDBACK_FILE_PATH,
        ENV_AUTH_FILE_PATH,
        ENV_NOTIFY_FILE_PATH,
      ],
    }),
  ],
})
export class PostsConfigModule {}

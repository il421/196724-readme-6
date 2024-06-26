import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { applicationConfig, jwtConfig } from '@project/core';
const ENV_FEEDBACK_FILE_PATH = 'apps/feedback/.env';
const ENV_AUTH_FILE_PATH = 'apps/.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, jwtConfig],
      envFilePath: [ENV_FEEDBACK_FILE_PATH, ENV_AUTH_FILE_PATH],
    }),
  ],
})
export class FeedbackConfigModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { applicationConfig, rabbitConfig } from '@project/core';

const ENV_NOTIFY_FILE_PATH = 'apps/notify/.env';
const ENV_AUTH_FILE_PATH = 'apps/.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, rabbitConfig],
      envFilePath: [ENV_NOTIFY_FILE_PATH, ENV_AUTH_FILE_PATH],
    }),
  ],
})
export class NotifyConfigModule {}

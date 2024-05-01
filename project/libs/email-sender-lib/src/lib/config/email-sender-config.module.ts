import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { mailConfig } from '@project/core';

const ENV_NOTIFY_FILE_PATH = 'apps/notify/.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [mailConfig],
      envFilePath: ENV_NOTIFY_FILE_PATH,
    }),
  ],
})
export class EmailSenderConfigModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { applicationConfig, httpClientConfig } from '@project/core';
const ENV_API_FILE_PATH = 'apps/api/.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, httpClientConfig],
      envFilePath: ENV_API_FILE_PATH,
    }),
  ],
})
export class ApiConfigModule {}

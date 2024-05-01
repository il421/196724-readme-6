import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  applicationConfig,
  jwtConfig,
  mongoConfig,
  rabbitConfig,
} from '@project/core';
const ENV_USERS_FILE_PATH = 'apps/users/.env';
const ENV_AUTH_FILE_PATH = 'apps/.env';
const ENV_NOTIFY_FILE_PATH = 'apps/notify/.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, mongoConfig, jwtConfig, rabbitConfig],
      envFilePath: [
        ENV_USERS_FILE_PATH,
        ENV_AUTH_FILE_PATH,
        ENV_NOTIFY_FILE_PATH,
      ],
    }),
  ],
})
export class UsersConfigModule {}

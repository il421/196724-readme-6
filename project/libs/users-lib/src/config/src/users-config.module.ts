import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { applicationConfig, jwtConfig, mongoConfig } from '@project/core';
const ENV_USERS_FILE_PATH = 'apps/users/.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, mongoConfig, jwtConfig],
      envFilePath: ENV_USERS_FILE_PATH,
    }),
  ],
})
export class UsersConfigModule {}

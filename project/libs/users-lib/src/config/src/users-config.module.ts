import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import mongoConfig from '../../../../shared/core/src/config/mongo.config';
import applicationConfig from '../../../../shared/core/src/config/app.config';
const ENV_USERS_FILE_PATH = 'apps/users/.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, mongoConfig],
      envFilePath: ENV_USERS_FILE_PATH,
    }),
  ],
})
export class UsersConfigModule {}

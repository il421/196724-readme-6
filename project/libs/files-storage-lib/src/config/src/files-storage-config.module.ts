import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import applicationConfig from '../../../../shared/core/src/config/app.config';
import mongoConfig from '../../../../shared/core/src/config/mongo.config';
const ENV_FILES_STORAGE_FILE_PATH = 'apps/files-storage/.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, mongoConfig],
      envFilePath: ENV_FILES_STORAGE_FILE_PATH,
    }),
  ],
})
export class FilesStorageConfigModule {}

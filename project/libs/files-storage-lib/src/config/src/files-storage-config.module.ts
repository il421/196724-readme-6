import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { applicationConfig, mongoConfig, storageConfig } from '@project/core';

const ENV_FILES_STORAGE_FILE_PATH = 'apps/files-storage/.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, mongoConfig, storageConfig],
      envFilePath: ENV_FILES_STORAGE_FILE_PATH,
    }),
  ],
})
export class FilesStorageConfigModule {}

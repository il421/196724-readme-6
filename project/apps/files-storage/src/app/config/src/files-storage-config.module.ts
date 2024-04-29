import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  applicationConfig,
  jwtConfig,
  mongoConfig,
  storageConfig,
} from '@project/core';

const ENV_FILES_STORAGE_FILE_PATH = 'apps/files-storage/.env';
const ENV_AUTH_FILE_PATH = 'apps/.env';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, mongoConfig, storageConfig, jwtConfig],
      envFilePath: [ENV_FILES_STORAGE_FILE_PATH, ENV_AUTH_FILE_PATH],
    }),
  ],
})
export class FilesStorageConfigModule {}

import { Module } from '@nestjs/common';
import { FilesStorageController } from './files-storage.controller';
import {
  FilesStorageFactory,
  FilesStorageRepository,
  FilesStorageService,
  FilesStorageConfigModule,
  FileModel,
  FileSchema,
} from '@project/files-storage-lib';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongooseOptions, getStaticStorageOptions } from '@project/core';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    FilesStorageConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
    MongooseModule.forFeature([{ name: FileModel.name, schema: FileSchema }]),
    ServeStaticModule.forRootAsync(getStaticStorageOptions()),
  ],
  controllers: [FilesStorageController],
  providers: [FilesStorageService, FilesStorageRepository, FilesStorageFactory],
})
export class FilesStorageModule {}

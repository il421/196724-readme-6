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
import {
  getJwtOptions,
  getMongooseOptions,
  getStaticStorageOptions,
} from '@project/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtAccessStrategy } from '@project/data-access';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    FilesStorageConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
    MongooseModule.forFeature([{ name: FileModel.name, schema: FileSchema }]),
    ServeStaticModule.forRootAsync(getStaticStorageOptions()),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtOptions,
    }),
  ],
  controllers: [FilesStorageController],
  providers: [
    FilesStorageService,
    FilesStorageRepository,
    FilesStorageFactory,
    JwtAccessStrategy,
  ],
})
export class FilesStorageModule {}

import { Module } from '@nestjs/common';
import { FilesStorageController } from './files-storage.controller';

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
import { FilesStorageConfigModule } from './config';
import { FileModel, FileSchema } from './file.model';
import { FilesStorageService } from './files-storage.service';
import { FilesStorageRepository } from './files-storage.repository';
import { FilesStorageFactory } from './files-storage.factory';

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

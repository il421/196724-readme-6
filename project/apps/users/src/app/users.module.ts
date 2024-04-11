import { Module } from '@nestjs/common';
import {
  UserFactory,
  UserModel,
  UserRepository,
  UserSchema,
  UsersConfigModule,
} from '@project/users-lib';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getMongooseOptions } from '@project/core';
import {
  FileModel,
  FileSchema,
  FilesStorageFactory,
  FilesStorageRepository,
  FilesStorageService,
} from '@project/files-storage-lib';

@Module({
  imports: [
    UsersConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: FileModel.name, schema: FileSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserRepository,
    UserFactory,
    FilesStorageService,
    FilesStorageRepository,
    FilesStorageFactory,
  ],
})
export class UsersModule {}

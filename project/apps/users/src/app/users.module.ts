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

@Module({
  imports: [
    UsersConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UserFactory],
})
export class UsersModule {}

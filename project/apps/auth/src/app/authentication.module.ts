import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import {
  UserFactory,
  UserModel,
  UserRepository,
  UserSchema,
  UsersConfigModule,
} from '@project/users-lib';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongooseOptions } from '@project/core';

@Module({
  imports: [
    UsersConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, UserRepository, UserFactory],
})
export class AuthenticationModule {}

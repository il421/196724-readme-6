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
import { getJwtOptions, getMongooseOptions } from '@project/core';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAccessStrategy } from '@project/data-access';

@Module({
  imports: [
    UsersConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtOptions,
    }),
    MongooseModule.forRootAsync(getMongooseOptions()),
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    UserRepository,
    UserFactory,
    JwtAccessStrategy,
  ],
})
export class AuthenticationModule {}

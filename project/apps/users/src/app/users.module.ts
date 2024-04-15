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
  SubscriptionModel,
  SubscriptionSchema,
} from '../../../subscriptions/src/app/subscription.model';

@Module({
  imports: [
    UsersConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
    MongooseModule.forFeature([
      { name: UserModel.name, schema: UserSchema },
      { name: SubscriptionModel.name, schema: SubscriptionSchema }, // move subs model to libs
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository, UserFactory],
})
export class UsersModule {}

import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsRepository } from './subscriptions.repository';
import { SubscriptionsFactory } from './subscriptions.factory';
import { MongooseModule } from '@nestjs/mongoose';
import { getJwtOptions, getMongooseOptions } from '@project/core';
import { UsersConfigModule } from '@project/users-lib';
import { SubscriptionModel, SubscriptionSchema } from './subscription.model';
import { JwtAccessStrategy } from '@project/data-access';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
    MongooseModule.forFeature([
      { name: SubscriptionModel.name, schema: SubscriptionSchema },
    ]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtOptions,
    }),
  ],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    SubscriptionsRepository,
    SubscriptionsFactory,
    JwtAccessStrategy,
  ],
})
export class SubscriptionsModule {}

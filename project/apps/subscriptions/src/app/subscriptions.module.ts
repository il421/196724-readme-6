import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsRepository } from './subscriptions.repository';
import { SubscriptionsFactory } from './subscriptions.factory';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongooseOptions } from '@project/core';
import { UsersConfigModule } from '@project/users-lib';
import { SubscriptionModel, SubscriptionSchema } from './subscription.model';

@Module({
  imports: [
    UsersConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
    MongooseModule.forFeature([
      { name: SubscriptionModel.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    SubscriptionsRepository,
    SubscriptionsFactory,
  ],
})
export class SubscriptionsModule {}

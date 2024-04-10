import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsRepository } from './subscriptions.repository';
import { SubscriptionsFactory } from './subscriptions.factory';
import { SubscriptionsConfigModule } from '@project/subscriptions-lib';

@Module({
  imports: [SubscriptionsConfigModule],
  controllers: [SubscriptionsController],
  providers: [
    SubscriptionsService,
    SubscriptionsRepository,
    SubscriptionsFactory,
  ],
})
export class SubscriptionsModule {}

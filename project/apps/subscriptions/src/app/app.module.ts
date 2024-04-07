import { Module } from '@nestjs/common';
import { SubscriptionsModule } from '@project/subscriptions-lib';

@Module({
  imports: [SubscriptionsModule],
})
export class AppModule {}

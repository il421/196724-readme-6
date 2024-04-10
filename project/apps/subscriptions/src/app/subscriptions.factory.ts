import { IEntityFactory, Subscription } from '@project/core';
import { Injectable } from '@nestjs/common';
import { SubscriptionsEntity } from './subscriptions.entity';

@Injectable()
export class SubscriptionsFactory
  implements IEntityFactory<SubscriptionsEntity>
{
  public create(data: Subscription): SubscriptionsEntity {
    return new SubscriptionsEntity(data);
  }
}

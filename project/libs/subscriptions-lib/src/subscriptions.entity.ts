import { Entity, IStorableEntity, Subscription } from '@project/core';

export class SubscriptionsEntity
  extends Entity
  implements IStorableEntity<Subscription>
{
  public publisherId: string;
  public createdBy?: string;
  public createdAt?: string;
  constructor(subscription: Subscription) {
    const { id, publisherId, createdBy, createdAt } = subscription;
    super();
    this.id = id;
    this.publisherId = publisherId;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
  }

  toPlainData(): Subscription {
    return {
      id: this.id,
      publisherId: this.publisherId,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  }
}

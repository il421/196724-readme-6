import { Entity, IStorableEntity, Subscription } from '@project/core';

export class SubscriptionsEntity
  extends Entity
  implements IStorableEntity<Subscription>
{
  public authorId: string;
  public createdBy?: string;
  public createdAt?: string;
  constructor(subscription: Subscription) {
    const { id, authorId, createdBy, createdAt } = subscription;
    super();
    this.id = id;
    this.authorId = authorId;
    this.createdBy = createdBy;
    this.createdAt = createdAt ?? new Date().toISOString();
  }

  toPlainData(): Subscription {
    return {
      id: this.id,
      authorId: this.authorId,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  }
}

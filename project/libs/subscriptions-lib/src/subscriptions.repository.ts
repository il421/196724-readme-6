import { MemoryRepository } from '@project/data-access';
import { SubscriptionsEntity } from './subscriptions.entity';
import { Injectable } from '@nestjs/common';
import { SubscriptionsFactory } from './subscriptions.factory';
import { ErrorMessages, Subscription } from '@project/core';

@Injectable()
export class SubscriptionsRepository extends MemoryRepository<SubscriptionsEntity> {
  constructor(entityFactory: SubscriptionsFactory) {
    super(entityFactory);
  }

  public deleteByPublisherId(publisherId: string) {
    const entities = Array.from(this.entities.values());
    const entity = entities.find(
      (entity) => entity.publisherId === publisherId
    );

    if (!entity) {
      throw new Error(ErrorMessages.EntityNotFound);
    }

    this.entities.delete(entity.id);
  }

  public findByUserId(userId: string) {
    const entities = Array.from(this.entities.values());
    return entities
      .filter((entity) => entity.createdBy === userId)
      .map(this.entityFactory.create);
  }
}

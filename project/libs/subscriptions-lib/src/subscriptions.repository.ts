import { MemoryRepository } from '@project/data-access';
import { SubscriptionsEntity } from './subscriptions.entity';
import { Injectable } from '@nestjs/common';
import { SubscriptionsFactory } from './subscriptions.factory';

@Injectable()
export class SubscriptionsRepository extends MemoryRepository<SubscriptionsEntity> {
  constructor(entityFactory: SubscriptionsFactory) {
    super(entityFactory);
  }

  public findByAuthorId(userId: string, authorId: string) {
    const entities = Array.from(this.entities.values());
    return entities.find(
      (entity) => entity.createdBy === userId && entity.authorId === authorId
    );
  }

  public findByUserId(userId: string) {
    const entities = Array.from(this.entities.values());
    return entities
      .filter((entity) => entity.createdBy === userId)
      .map(this.entityFactory.create);
  }
}

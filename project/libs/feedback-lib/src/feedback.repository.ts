import { MemoryRepository } from '@project/data-access';
import { FeedbackEntity } from './feedback.entity';
import { Injectable } from '@nestjs/common';
import { FeedbackFactory } from './feedback.factory';
import { Comment } from '@project/core';

@Injectable()
export class FeedbackRepository extends MemoryRepository<FeedbackEntity> {
  constructor(entityFactory: FeedbackFactory) {
    super(entityFactory);
  }

  public findByPostId(postId: string) {
    const entities = Array.from(this.entities.values());

    const comments = entities.filter(
      (entity: Comment): boolean => entity.postId === postId
    );

    return comments.map((comment) => this.entityFactory.create(comment));
  }
}

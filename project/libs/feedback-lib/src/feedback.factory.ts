import { IEntityFactory, Comment } from '@project/core';
import { Injectable } from '@nestjs/common';
import { FeedbackEntity } from './feedback.entity';

@Injectable()
export class FeedbackFactory implements IEntityFactory<FeedbackEntity> {
  public create(data: Comment): FeedbackEntity {
    return new FeedbackEntity(data);
  }
}

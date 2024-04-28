import { IEntityFactory, Comment } from '@project/core';
import { Injectable } from '@nestjs/common';
import { CommentEntity } from './entities/comment.entity';

@Injectable()
export class FeedbackFactory implements IEntityFactory<CommentEntity> {
  public create(data: Comment): CommentEntity {
    return new CommentEntity(data);
  }
}

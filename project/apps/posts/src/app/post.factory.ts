import { Post, IEntityFactory } from '@project/core';
import { Injectable } from '@nestjs/common';
import { PostEntity } from './post.entity';

@Injectable()
export class PostFactory implements IEntityFactory<PostEntity> {
  public create(data: Post): PostEntity {
    return new PostEntity(data);
  }
}

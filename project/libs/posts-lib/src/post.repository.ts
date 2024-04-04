import { MemoryRepository } from '@project/data-access';
import { PostEntity } from './post.entity';
import { Injectable } from '@nestjs/common';
import { PostFactory } from './post.factory';
import { PostState } from '@project/core';

@Injectable()
export class PostRepository extends MemoryRepository<PostEntity> {
  constructor(entityFactory: PostFactory) {
    super(entityFactory);
  }

  public findPosts(usersIds: string[], tags?: string[]) {
    const entities = Array.from(this.entities.values());
    return entities
      .filter(
        (entry) =>
          entry.createdBy &&
          usersIds.includes(entry.createdBy) &&
          entry.tags?.some((tag) => tags?.includes(tag)) &&
          entry.state === PostState.Published
      )
      .map((post) => this.entityFactory.create(post));
  }

  public search(title: string) {
    const entities = Array.from(this.entities.values());
    return entities
      .filter(
        (entry) =>
          entry.title.includes(title) && entry.state === PostState.Published
      )
      .map((post) => this.entityFactory.create(post));
  }
}

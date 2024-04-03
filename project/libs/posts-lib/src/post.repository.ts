import { MemoryRepository } from '@project/data-access';
import { PostEntity } from './post.entity';
import { Injectable } from '@nestjs/common';
import { PostFactory } from './post.factory';

@Injectable()
export class PostRepository extends MemoryRepository<PostEntity> {
  constructor(entityFactory: PostFactory) {
    super(entityFactory);
  }

  public findPosts(usersIds: string[]) {
    const entities = Array.from(this.entities.values());
    return entities
      .filter((entry) => entry.createdBy && usersIds.includes(entry.createdBy))
      .map((post) => this.entityFactory.create(post));
  }

  public search(name: string) {
    const entities = Array.from(this.entities.values());
    return entities
      .filter((entry) => entry.title.includes(name))
      .map((post) => this.entityFactory.create(post));
  }
}

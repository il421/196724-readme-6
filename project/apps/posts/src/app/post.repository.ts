import { MemoryRepository, PostgresRepository } from '@project/data-access';
import { PostEntity } from './post.entity';
import { Injectable } from '@nestjs/common';
import { PostFactory } from './post.factory';
import { Post, PostState, PostType } from '@project/core';
import { PrismaClientService } from '@project/prisma-client';
import {
  DEFAULT_NUMBER_OF_POSTS,
  DEFAULT_NUMBER_OF_POSTS_BY_TITLE,
} from './post.restrictions';

@Injectable()
export class PostRepository extends PostgresRepository<PostEntity, Post> {
  constructor(
    entityFactory: PostFactory,
    readonly client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  public async save(entity: PostEntity): Promise<void> {
    const record = await this.client.post.create({
      data: { ...entity.toPlainData() },
    });

    entity.id = record.id;
  }

  public async findPosts(
    usersIds?: string[],
    tags?: string[],
    types?: PostType[],
    state?: PostState
  ) {
    const documents = await this.client.post.findMany({
      // where: { title, state: PostState.Published },
      take: DEFAULT_NUMBER_OF_POSTS,
    });
    return documents.map((document) => this.createEntityFromDocument(document));
  }

  public async searchByTitle(title: string) {
    const documents = await this.client.post.findMany({
      where: { title, state: PostState.Published },
      take: DEFAULT_NUMBER_OF_POSTS_BY_TITLE,
      include: { _count: { select: { comments: true } } },
    });
    return documents.map((document) => this.createEntityFromDocument(document));
  }

  public async findById(id: string) {
    const document = await this.client.post.findFirst({
      where: { id: id },
    });
    return this.createEntityFromDocument(document);
  }
}

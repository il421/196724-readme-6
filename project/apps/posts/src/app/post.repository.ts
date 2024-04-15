import { MemoryRepository, PostgresRepository } from '@project/data-access';
import { PostEntity } from './post.entity';
import { Injectable } from '@nestjs/common';
import { PostFactory } from './post.factory';
import { Post, PostState, PostType } from '@project/core';
import { PrismaClientService } from '@project/prisma-client';

@Injectable()
export class PostRepository extends PostgresRepository<PostEntity, Post> {
  constructor(
    entityFactory: PostFactory,
    readonly client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  public async saveComment(entity: PostEntity): Promise<void> {
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
    });
    return documents.map((document) => this.createEntityFromDocument(document));
  }

  public async searchByTitle(title: string) {
    const documents = await this.client.post.findMany({
      where: { title, state: PostState.Published },
    });
    return documents.map((document) => this.createEntityFromDocument(document));
  }

  public async findCommentById(id: string) {
    const document = await this.client.post.findFirst({
      where: { id },
    });
    return this.createEntityFromDocument(document);
  }
}

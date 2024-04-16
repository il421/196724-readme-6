import { PostgresRepository } from '@project/data-access';
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

  private readonly include = {
    _count: { select: { comments: true, likes: true } },
  };

  public async create(data: Post): Promise<PostEntity> {
    const document = await this.client.post.create({
      data,
      include: this.include,
    });

    const entity = this.createEntityFromDocument(document);
    entity.id = document.id;
    return entity;
  }

  public async adjust(id: string, data: Partial<Post>): Promise<PostEntity> {
    const document = await this.client.post.update({
      where: { id },
      data,
    });

    return this.createEntityFromDocument(document);
  }

  public async findPosts(
    usersIds?: string[],
    tags?: string[],
    types?: PostType[],
    state?: PostState
  ) {
    // @TODO not done yet
    const documents = await this.client.post.findMany({
      // where: { title, state: PostState.Published },
      take: DEFAULT_NUMBER_OF_POSTS,
      include: this.include,
    });
    return documents.map((document) => this.createEntityFromDocument(document));
  }

  public async searchByTitle(title: string) {
    const documents = await this.client.post.findMany({
      where: { title, state: PostState.Published },
      take: DEFAULT_NUMBER_OF_POSTS_BY_TITLE,
      include: this.include,
    });
    return documents.map((document) => this.createEntityFromDocument(document));
  }

  public async findById(id: string) {
    const document = await this.client.post.findFirst({
      where: { id },
      include: this.include,
    });
    return this.createEntityFromDocument(document);
  }

  public async delete(id: string) {
    return this.client.post.delete({
      where: { id },
    });
  }
}

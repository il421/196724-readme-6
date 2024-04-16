import { PostgresRepository } from '@project/data-access';
import { PostEntity } from './post.entity';
import { Injectable } from '@nestjs/common';
import { PostFactory } from './post.factory';
import { Post, PostState, PostType } from '@project/core';
import { PrismaClientService } from '@project/prisma-client';
import { DEFAULT_NUMBER_OF_POSTS } from './post.restrictions';

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

  public async findPosts(args: {
    usersIds?: string[];
    tags?: string[];
    types?: PostType[];
    state?: PostState;
    title?: string;
  }) {
    const { usersIds = [], tags = [], state, types = [], title } = args;

    const documents = await this.client.post.findMany({
      where: {
        ...(usersIds?.length && { createdBy: { in: usersIds } }),
        ...(tags?.length && { tags: { hasSome: tags } }),
        ...(types?.length && { type: { in: types } }),
        ...(title && { title: { contains: title } }),
        state: state ?? PostState.Published,
      },
      take: DEFAULT_NUMBER_OF_POSTS, // @TODO just a default for now
      include: this.include,
      orderBy: { publishedAt: 'desc' }, // @TODO desc is default, but should be possible a user pass an extra param
      // @TODO also need o have an option to sort my likes and comments
    });
    return documents.map(this.createEntityFromDocument);
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

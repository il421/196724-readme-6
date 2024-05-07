import { PostgresRepository } from '@project/data-access';
import { PostEntity } from './post.entity';
import { Injectable } from '@nestjs/common';
import { PostFactory } from './post.factory';
import {
  PaginationResult,
  Post,
  PostState,
  SortDirection,
} from '@project/core';
import { PrismaClientService } from '@project/prisma-client';
import { DEFAULT_NUMBER_OF_POSTS, DEFAULT_PAGE } from './post.constants';
import { SearchPostsQuery } from './serach-post.query';
import { Prisma } from '.prisma/client';
import { calculatePage, getSkipPages } from '@project/helpers';

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

  private async getPostCount(where: Prisma.PostWhereInput): Promise<number> {
    return this.client.post.count({ where });
  }

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
    args: SearchPostsQuery
  ): Promise<PaginationResult<PostEntity>> {
    const {
      usersIds = [],
      tags = [],
      state,
      types = [],
      title,
      fromPublishDate,
      page = DEFAULT_PAGE,
      limit = DEFAULT_NUMBER_OF_POSTS,
      sortDirection = SortDirection.Desc,
    } = args;
    const skip = getSkipPages(page, limit);
    const take = limit;

    const where: Prisma.PostWhereInput = {
      state: state ?? PostState.Published,
    };

    if (usersIds?.length) where.createdBy = { in: usersIds };
    if (tags?.length) where.tags = { hasSome: tags };
    if (types?.length) where.type = { in: types };
    if (title) where.title = { contains: title };
    if (fromPublishDate) where.publishedAt = { gte: fromPublishDate };

    const [documents, totalItems] = await Promise.all([
      this.client.post.findMany({
        where,
        take,
        skip,
        include: this.include,
        orderBy: {
          publishedAt: sortDirection,
          // likes: { _count: SortDirection.Asc }, // @TODO I am getting an error for some reason in here
          // comments: { _count: SortDirection.Asc }, // @TODO I am getting an error for some reason in here
        },
      }),
      this.getPostCount(where),
    ]);

    return {
      entities: documents.map(this.createEntityFromDocument),
      currentPage: page,
      totalPages: calculatePage(totalItems, take),
      itemsPerPage: take,
      totalItems,
    };
  }

  public async findById(id: string) {
    const document = await this.client.post.findFirst({
      where: { id },
      include: this.include,
    });
    return this.createEntityFromDocument(document);
  }

  public delete(id: string) {
    return this.client.post.delete({
      where: { id },
    });
  }
}

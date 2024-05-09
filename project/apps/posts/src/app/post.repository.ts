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
import {
  DEFAULT_NUMBER_OF_POSTS,
  DEFAULT_PAGE,
  SearchPostsQuery,
} from '@project/posts-lib';
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

  public async getPostCount(where: Prisma.PostWhereInput): Promise<number> {
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

    const [documents, totalItems] = await Promise.all([
      this.client.post.findMany({
        where,
        take,
        skip,
        include: this.include,
        orderBy: [
          {
            publishedAt: sortDirection,
          },
          {
            likes: { _count: SortDirection.Desc },
          },
          {
            comments: { _count: SortDirection.Desc },
          },
        ],
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

  public async findUsersPosts(usersIds: string[]) {
    const documents = await this.client.post.findMany({
      where: { createdBy: { in: usersIds }, state: PostState.Published },
      orderBy: {
        publishedAt: SortDirection.Desc,
      },
    });
    return documents.map(this.createEntityFromDocument);
  }

  public async findPostsFromDate(date: Date) {
    const documents = await this.client.post.findMany({
      where: { publishedAt: { gte: date }, state: PostState.Published },
      include: this.include,
      orderBy: {
        publishedAt: SortDirection.Desc,
      },
    });
    return documents.map(this.createEntityFromDocument);
  }

  public async delete(id: string) {
    const deletePost = await this.client.post.delete({
      where: { id },
    });
    return this.createEntityFromDocument(deletePost);
  }
}

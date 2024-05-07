import { PostgresRepository } from '@project/data-access';
import { CommentEntity, LikeEntity } from './entities';
import { Injectable } from '@nestjs/common';
import { FeedbackFactory } from './feedback.factory';
import { Comment, PaginationResult } from '@project/core';
import { PrismaClientService } from '@project/prisma-client';
import {
  DEFAULT_NUMBER_OF_COMMENTS,
  DEFAULT_PAGE,
} from './feedback.restrictions';
import { calculatePage, getSkipPages } from '@project/helpers';
import { Prisma } from '.prisma/client';

@Injectable()
export class FeedbackRepository extends PostgresRepository<
  CommentEntity,
  Comment
> {
  constructor(
    entityFactory: FeedbackFactory,
    readonly client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  private async getCommentsCount(
    where: Prisma.CommentWhereInput
  ): Promise<number> {
    return this.client.comment.count({ where });
  }

  public async saveComment(entity: CommentEntity): Promise<void> {
    const record = await this.client.comment.create({
      data: { ...entity.toPlainData() },
    });

    entity.id = record.id;
  }

  public async findCommentById(id: string) {
    const document = await this.client.comment.findUnique({ where: { id } });
    return this.createEntityFromDocument(document);
  }

  public async findCommentsByPostId(
    postId: string,
    limit?: number,
    page?: number
  ): Promise<PaginationResult<CommentEntity>> {
    const take = limit ?? DEFAULT_NUMBER_OF_COMMENTS;

    const skip = getSkipPages(page, take);
    const where = { postId };

    const [documents, totalItems] = await Promise.all([
      this.client.comment.findMany({
        where,
        take,
        skip,
      }),
      this.getCommentsCount(where),
    ]);

    return {
      entities: documents.map(this.createEntityFromDocument),
      currentPage: page ?? DEFAULT_PAGE,
      totalPages: calculatePage(totalItems, take),
      itemsPerPage: take,
      totalItems,
    };
  }

  public async deleteCommentById(id: string) {
    await this.client.comment.delete({ where: { id } });
  }

  public async findLike(userId: string, postId: string) {
    const document = await this.client.like.findFirst({
      where: { createdBy: userId, postId },
    });
    if (document) {
      return new LikeEntity(document);
    }
    return null;
  }

  public async deleteLike(userId: string, postId: string) {
    await this.client.like.deleteMany({ where: { createdBy: userId, postId } });
  }

  public async saveLike(entity: LikeEntity) {
    const record = await this.client.like.create({
      data: { ...entity.toPlainData() },
    });

    entity.id = record.id;
  }
}

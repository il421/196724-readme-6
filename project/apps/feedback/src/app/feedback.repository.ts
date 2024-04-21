import { PostgresRepository } from '@project/data-access';
import { CommentEntity } from './entities/comment.entity';
import { Injectable } from '@nestjs/common';
import { FeedbackFactory } from './feedback.factory';
import { Comment } from '@project/core';
import { PrismaClientService } from '@project/prisma-client';
import { LikeEntity } from './entities/like.entity';
import { DEFAULT_NUMBER_OF_COMMENTS } from './feedback.restrictions';

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

  public async findCommentsByPostId(postId: string) {
    const documents = await this.client.comment.findMany({
      where: { postId },
      take: DEFAULT_NUMBER_OF_COMMENTS,
    });
    return documents.map((document) => this.createEntityFromDocument(document));
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

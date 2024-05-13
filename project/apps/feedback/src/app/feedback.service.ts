import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from '@project/feedback-lib';
import { FeedbackRepository } from './feedback.repository';
import { ERROR_MESSAGES, PostState } from '@project/core';
import { CommentEntity, LikeEntity } from './entities';

@Injectable()
export class FeedbackService {
  constructor(private feedbackRepository: FeedbackRepository) {}

  public async createComment(
    userId: string,
    dto: CreateCommentDto
  ): Promise<CommentEntity> {
    const post = await this.feedbackRepository.client.post.findUnique({
      where: { id: dto.postId },
    });
    if (!post) {
      throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
    } else {
      const commentEntity = new CommentEntity({ ...dto, createdBy: userId });
      await this.feedbackRepository.saveComment(commentEntity);
      return commentEntity;
    }
  }

  public async getCommentsByPostId(
    postId: string,
    limit?: number,
    page?: number
  ) {
    return this.feedbackRepository.findCommentsByPostId(postId, limit, page);
  }

  public async deleteComment(userId: string, id: string) {
    const comment = await this.feedbackRepository.findCommentById(id);
    if (!comment) {
      throw new NotFoundException(ERROR_MESSAGES.COMMENT_NOT_FOUND);
    } else {
      if (comment.createdBy !== userId)
        throw new BadRequestException(
          ERROR_MESSAGES.COMMENT_OTHER_USERS_DELETE
        );
    }
    return void (await this.feedbackRepository.deleteCommentById(id));
  }

  public async like(userId: string, postId: string): Promise<void> {
    const post = await this.feedbackRepository.client.post.findUnique({
      where: { id: postId },
    });

    if (!post) throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
    if (post.state !== PostState.Published)
      throw new BadRequestException(ERROR_MESSAGES.POST_NOT_PUBLISHED);

    const like = await this.feedbackRepository.client.like.findFirst({
      where: { postId: postId, createdBy: userId },
    });

    if (like) throw new BadRequestException(ERROR_MESSAGES.POST_ALREADY_LIKED);

    return await this.feedbackRepository.saveLike(
      new LikeEntity({ postId, createdBy: userId })
    );
  }

  public async unlike(userId: string, postId: string): Promise<void> {
    const postEntity = await this.feedbackRepository.client.post.findUnique({
      where: { id: postId },
    });

    if (!postEntity) throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
    if (postEntity.state !== PostState.Published)
      throw new BadRequestException(ERROR_MESSAGES.POST_NOT_PUBLISHED);

    const likeEntity = await this.feedbackRepository.findLike(userId, postId);
    if (!likeEntity)
      throw new BadRequestException(ERROR_MESSAGES.POST_NOT_LIKED);

    return void (await this.feedbackRepository.deleteLike(userId, postId));
  }
}

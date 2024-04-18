import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dtos';
import { FeedbackRepository } from './feedback.repository';
import { CommentEntity } from './comment.entity';
import { ERROR_MESSAGES, PostState } from '@project/core';
import { PostEntity } from '../../../posts/src/app/post.entity';
import { LikeEntity } from './like.entity';

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
    if (post) {
      const commentEntity = new CommentEntity({ ...dto, createdBy: userId });
      await this.feedbackRepository.saveComment(commentEntity);
      return commentEntity;
    } else {
      throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
    }
  }

  public async getCommentsByPostId(postId: string) {
    return this.feedbackRepository.findCommentsByPostId(postId);
  }

  public async deleteComment(userId: string, id: string) {
    const comment = await this.feedbackRepository.findCommentById(id);
    if (comment) {
      if (comment.createdBy === userId)
        return void (await this.feedbackRepository.deleteCommentById(id));
      throw new BadRequestException(ERROR_MESSAGES.COMMENT_OTHER_USERS_DELETE);
    }
    throw new NotFoundException(ERROR_MESSAGES.COMMENT_NOT_FOUND);
  }

  public async like(userId: string, postId: string): Promise<void> {
    const post = await this.feedbackRepository.client.post.findUnique({
      where: { id: postId },
    });

    if (post) {
      if (post.state === PostState.Published) {
        const like = this.feedbackRepository.client.like.findFirst({
          where: { postId: postId, createdBy: userId },
        });

        if (!like) {
          return await this.feedbackRepository.saveLike(
            new LikeEntity({ postId, createdBy: userId })
          );
        }
        throw new BadRequestException(ERROR_MESSAGES.POST_ALREADY_LIKED);
      }
      throw new BadRequestException(ERROR_MESSAGES.POST_NOT_PUBLISHED);
    }
    throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
  }

  public async unlike(userId: string, postId: string): Promise<void> {
    const postEntity = await this.feedbackRepository.client.post.findUnique({
      where: { id: postId },
    });

    if (postEntity) {
      if (postEntity.state === PostState.Published) {
        const likeEntity = await this.feedbackRepository.findLike(
          userId,
          postId
        );
        if (likeEntity) {
          return void (await this.feedbackRepository.deleteLike(
            userId,
            postId
          ));
        }
        throw new BadRequestException(ERROR_MESSAGES.POST_NOT_LIKED);
      }
      throw new BadRequestException(ERROR_MESSAGES.POST_NOT_PUBLISHED);
    }
    throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
  }
}

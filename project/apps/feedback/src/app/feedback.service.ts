import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dtos';
import { FeedbackRepository } from './feedback.repository';
import { CommentEntity } from './comment.entity';
import { ErrorMessages, PostState } from '@project/core';
import { PostEntity } from '../../../posts/src/app/post.entity';
import { LikeEntity } from './like.entity';

@Injectable()
export class FeedbackService {
  constructor(private feedbackRepository: FeedbackRepository) {}

  public async createComment(
    userId: string,
    dto: CreateCommentDto
  ): Promise<CommentEntity> {
    const commentEntity = new CommentEntity({ ...dto, createdBy: userId });
    await this.feedbackRepository.saveComment(commentEntity);
    return commentEntity;
  }

  public async getCommentsByPostId(postId: string) {
    return this.feedbackRepository.findCommentsByPostId(postId);
  }

  public async deleteComment(userId: string, id: string) {
    const comment = await this.feedbackRepository.findCommentById(id);
    if (comment) {
      if (comment.createdBy === userId)
        return this.feedbackRepository.deleteCommentById(id);
      throw new BadRequestException(ErrorMessages.CommentUserError);
    }
    throw new NotFoundException(ErrorMessages.CommentNotFound);
  }

  public async like(userId: string, postId: string): Promise<void> {
    const postEntity = await this.feedbackRepository.client.post.findUnique({
      where: { id: postId },
    });

    if (postEntity) {
      if (postEntity.state === PostState.Published) {
        return await this.feedbackRepository.saveLike(
          new LikeEntity({ postId, createdBy: userId })
        );
      }
      throw new BadRequestException(ErrorMessages.PostNotPublish);
    }
    throw new NotFoundException(ErrorMessages.PostNotFound);
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
          return await this.feedbackRepository.deleteLike(userId, postId);
        }
        throw new BadRequestException(ErrorMessages.NoLiked);
      }
      throw new BadRequestException(ErrorMessages.PostNotPublish);
    }
    throw new NotFoundException(ErrorMessages.PostNotFound);
  }
}

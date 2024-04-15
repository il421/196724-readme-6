import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dtos';
import { FeedbackRepository } from './feedback.repository';
import { CommentEntity } from './comment.entity';
import { ErrorMessages } from '@project/core';
import { PostEntity } from '../../../posts/src/app/post.entity';
import { LikeEntity } from './like.entity';

@Injectable()
export class FeedbackService {
  constructor(private feedbackRepository: FeedbackRepository) {}

  public async create(
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

  public async delete(userId: string, id: string) {
    const comment = await this.feedbackRepository.findCommentById(id);
    if (comment) {
      if (comment.createdBy === userId)
        return this.feedbackRepository.deleteCommentById(id);
      throw new BadRequestException(ErrorMessages.CommentUserError);
    }
    throw new NotFoundException(ErrorMessages.CommentNotFound);
  }

  public async like(userId: string, postId: string): Promise<void> {
    const postEntity = await this.feedbackRepository.findLike(userId, postId);
    if (postEntity) {
      return await this.feedbackRepository.deleteLike(userId, postId);
    }
    return await this.feedbackRepository.saveLike(
      new LikeEntity({ postId, createdBy: userId })
    );
  }
}

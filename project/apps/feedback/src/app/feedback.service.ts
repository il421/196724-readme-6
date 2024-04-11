import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommentDto } from './dtos';
import { FeedbackRepository } from './feedback.repository';
import { FeedbackEntity } from './feedback.entity';
import { ErrorMessages } from '@project/core';

@Injectable()
export class FeedbackService {
  constructor(private feedbackRepository: FeedbackRepository) {}

  public async create(dto: CreateCommentDto): Promise<FeedbackEntity> {
    const feedbackEntity = new FeedbackEntity(dto);
    await this.feedbackRepository.save(feedbackEntity);
    return feedbackEntity;
  }

  public async getCommentsByPostId(postId: string) {
    return this.feedbackRepository.findByPostId(postId);
  }

  public async delete(userId: string, id: string) {
    const comment = await this.feedbackRepository.findById(id);
    if (comment) {
      if (comment.createdBy === userId)
        return this.feedbackRepository.deleteById(id);
      throw new BadRequestException(ErrorMessages.CommentUserError);
    }
    throw new NotFoundException(ErrorMessages.CommentNotFound);
  }
}

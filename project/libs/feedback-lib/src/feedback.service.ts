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
  constructor(private postRepository: FeedbackRepository) {}

  public async create(dto: CreateCommentDto): Promise<FeedbackEntity> {
    const postEntity = new FeedbackEntity(dto);
    await this.postRepository.save(postEntity);
    return postEntity;
  }

  public async getCommentsByPostId(postId: string) {
    return this.postRepository.findByPostId(postId);
  }

  public async delete(userId: string, id: string) {
    const comment = await this.postRepository.findById(id);
    if (comment) {
      if (comment.createdBy === userId)
        return this.postRepository.deleteById(id);
      throw new BadRequestException(ErrorMessages.CommentUserError);
    }
    throw new NotFoundException(ErrorMessages.CommentNotFound);
  }
}

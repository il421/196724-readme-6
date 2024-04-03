import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dtos';
import { FeedbackRepository } from './feedback.repository';
import { FeedbackEntity } from './feedback.entity';

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

  public async delete(id: string) {
    return this.postRepository.deleteById(id);
  }
}

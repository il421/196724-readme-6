import { Injectable } from '@nestjs/common';
import { CreateSubscriptionDto } from './dtos';
import { SubscriptionsRepository } from './subscriptions.repository';
import { SubscriptionsEntity } from './subscriptions.entity';

@Injectable()
export class SubscriptionsService {
  constructor(private subscriptionsRepository: SubscriptionsRepository) {}

  public async find(userId: string): Promise<SubscriptionsEntity[]> {
    return this.subscriptionsRepository.findByUserId(userId);
  }

  public async create(
    dto: CreateSubscriptionDto
  ): Promise<SubscriptionsEntity> {
    const postEntity = new SubscriptionsEntity(dto);
    await this.subscriptionsRepository.save(postEntity);
    return postEntity;
  }

  public async delete(publisherId: string) {
    return this.subscriptionsRepository.deleteByPublisherId(publisherId);
  }
}

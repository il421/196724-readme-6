import { Inject, Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { ConfigType } from '@nestjs/config';

import { RabbitRouting } from '@project/core';
import { CreatePostsNotificationDto, CreatePostsEmailDto } from './dtos';
import { rabbitConfig } from '@project/core';

@Injectable()
export class NotificationService {
  constructor(
    private readonly rabbitClient: AmqpConnection,
    @Inject(rabbitConfig.KEY)
    private readonly rabbiOptions: ConfigType<typeof rabbitConfig>
  ) {}

  public async receiveLatestPosts(dto: CreatePostsNotificationDto) {
    return this.rabbitClient.publish<CreatePostsNotificationDto>(
      this.rabbiOptions.exchange,
      RabbitRouting.ReceiveLatestPosts,
      { ...dto }
    );
  }

  public async sendLatestPostsEmail(dto: CreatePostsEmailDto) {
    return this.rabbitClient.publish<CreatePostsEmailDto>(
      this.rabbiOptions.exchange,
      RabbitRouting.SendLatestPostsEmail,
      { ...dto }
    );
  }
}

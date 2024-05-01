import { Controller } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  CreatePostsEmailDto,
  RABBIT_EXCHANGE,
} from '@project/notification-lib';
import { RabbitRouting } from '@project/core';
import { EmailSenderService } from '@project/email-sender-lib';

@Controller()
export class NotifyController {
  constructor(private readonly emailSenderService: EmailSenderService) {}

  @RabbitSubscribe({
    exchange: RABBIT_EXCHANGE,
    routingKey: RabbitRouting.SendLatestPostsEmail,
  })
  public sentLatestPostsEmail(subscriber: CreatePostsEmailDto) {
    return this.emailSenderService.sendNewPostsEmail(subscriber);
  }
}

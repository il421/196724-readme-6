import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

import { NotificationService } from './notification.service';
import { getRabbitMQOptions } from '@project/core';

@Module({
  imports: [RabbitMQModule.forRootAsync(RabbitMQModule, getRabbitMQOptions())],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}

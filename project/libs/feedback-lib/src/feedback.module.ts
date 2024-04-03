import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { FeedbackRepository } from './feedback.repository';
import { FeedbackFactory } from './feedback.factory';

@Module({
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepository, FeedbackFactory],
})
export class FeedbackModule {}

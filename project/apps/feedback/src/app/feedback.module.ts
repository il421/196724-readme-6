import { Module } from '@nestjs/common';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { FeedbackRepository } from './feedback.repository';
import { FeedbackFactory } from './feedback.factory';
import { FeedbackConfigModule } from '@project/feedback-lib';
import { PrismaClientModule } from '@project/prisma-client';

@Module({
  imports: [FeedbackConfigModule, PrismaClientModule],
  controllers: [FeedbackController],
  providers: [FeedbackService, FeedbackRepository, FeedbackFactory],
})
export class FeedbackModule {}

import { Module } from '@nestjs/common';
import { FeedbackModule } from '@project/feedback-lib';

@Module({
  imports: [FeedbackModule],
})
export class AppModule {}

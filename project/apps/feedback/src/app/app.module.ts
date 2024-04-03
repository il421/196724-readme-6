import { Module } from '@nestjs/common';
import { FeedbackModule } from '@project/feedback-lib';

@Module({
  imports: [FeedbackModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

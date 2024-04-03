import { Module } from '@nestjs/common';
import { PostModule } from '@project/posts-lib';

@Module({
  imports: [PostModule],
})
export class AppModule {}

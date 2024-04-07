import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { PostFactory } from './post.factory';

@Module({
  controllers: [PostController],
  providers: [PostService, PostRepository, PostFactory],
})
export class PostModule {}

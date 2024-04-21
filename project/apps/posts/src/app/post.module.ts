import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { PostFactory } from './post.factory';
import { PostsConfigModule } from '@project/posts-lib';
import { PrismaClientModule } from '@project/prisma-client';
import { JwtAccessStrategy } from '@project/data-access';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getJwtOptions } from '@project/core';

@Module({
  imports: [
    PostsConfigModule,
    PrismaClientModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtOptions,
    }),
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository, PostFactory, JwtAccessStrategy],
})
export class PostModule {}

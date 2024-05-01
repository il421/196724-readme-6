import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { PostFactory } from './post.factory';
import { PrismaClientModule } from '@project/prisma-client';
import { JwtAccessStrategy } from '@project/data-access';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getJwtOptions } from '@project/core';
import { PostsConfigModule } from './config';
import { NotificationModule } from '@project/notification-lib';

@Module({
  imports: [
    PostsConfigModule,
    PrismaClientModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtOptions,
    }),
    NotificationModule,
  ],
  controllers: [PostController],
  providers: [PostService, PostRepository, PostFactory, JwtAccessStrategy],
})
export class PostModule {}

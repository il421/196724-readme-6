import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { ErrorMessages, PostState, PostType } from '@project/core';
import { PostRepository } from './post.repository';
import { PostEntity } from './post.entity';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  public async create(userId: string, dto: CreatePostDto): Promise<PostEntity> {
    const postEntity = new PostEntity({
      ...dto,
      createdBy: userId,
      state: PostState.Draft,
    });
    await this.postRepository.save(postEntity);
    return postEntity;
  }

  public async update(id: string, dto: UpdatePostDto): Promise<PostEntity> {
    const post = await this.postRepository.client.post.update({
      where: { id },
      data: dto,
    });
    if (post) {
      return new PostEntity(post);
    }
    throw new NotFoundException(ErrorMessages.PostNotFound);
  }

  public async publish(id: string, userId: string): Promise<PostEntity> {
    const postEntity = await this.postRepository.findById(id);
    if (postEntity) {
      if (postEntity.createdBy === userId) {
        const updatedPost = await this.postRepository.client.post.update({
          where: { id },
          data: {
            state: PostState.Published,
            publishedAt: new Date(),
            publishedBy: postEntity.createdBy,
          },
        });
        return new PostEntity(updatedPost);
      } else {
        new ConflictException(ErrorMessages.PostPublishConflict);
      }
    }
    throw new NotFoundException(ErrorMessages.PostNotFound);
  }

  public async repost(id: string, repostBy: string): Promise<PostEntity> {
    const postEntity = await this.postRepository.findById(id);
    if (postEntity) {
      const { id, tags, likes, ...rest } = postEntity;
      const payloadEntity = new PostEntity({
        ...rest,
        isRepost: true,
        publishedAt: new Date(),
        publishedBy: repostBy,
      });
      await this.postRepository.save(payloadEntity);
      return payloadEntity;
    }
    throw new NotFoundException(ErrorMessages.PostNotFound);
  }

  public async search(
    usersIds?: string[],
    tags?: string[],
    types?: PostType[],
    state?: PostState
  ) {
    return this.postRepository.findPosts(usersIds, tags, types, state);
  }

  public searchByTitle(title: string) {
    return this.postRepository.searchByTitle(title);
  }

  public async getPost(id: string) {
    const post = this.postRepository.findById(id);

    if (post) return post;
    throw new NotFoundException(ErrorMessages.PostNotFound);
  }

  public async delete(id: string) {
    return this.postRepository.client.post.delete({ where: { id } });
  }
}

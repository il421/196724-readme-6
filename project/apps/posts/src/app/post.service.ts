import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { ErrorMessages, PostState, PostType } from '@project/core';
import { PostRepository } from './post.repository';
import { PostEntity } from './post.entity';
import { fillDto } from '@project/helpers';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  public async create(userId: string, dto: CreatePostDto): Promise<PostEntity> {
    const postEntity = new PostEntity({ ...dto, createdBy: userId });

    const payload = fillDto(CreatePostDto, postEntity.toPlainData());
    return await this.postRepository.create(payload);
  }

  public async update(
    userId: string,
    id: string,
    dto: UpdatePostDto
  ): Promise<PostEntity> {
    const postEntity = await this.postRepository.findById(id);

    if (postEntity) {
      if (postEntity.createdBy === userId) {
        const payload = fillDto(UpdatePostDto, { ...dto, createdBy: userId });

        return await this.postRepository.adjust(id, payload);
      }
      throw new BadRequestException(ErrorMessages.PostUpdate);
    }
    throw new NotFoundException(ErrorMessages.PostNotFound);
  }

  public async publish(id: string, userId: string): Promise<PostEntity> {
    const postEntity = await this.postRepository.findById(id);
    if (postEntity) {
      if (postEntity.createdBy === userId) {
        if (postEntity.state === PostState.Draft) {
          return await this.postRepository.adjust(id, {
            createdBy: postEntity.createdBy,
            state: PostState.Published,
            publishedAt: new Date(),
            publishedBy: postEntity.createdBy,
          });
        }
        throw new BadRequestException(ErrorMessages.PostPublish);
      } else {
        throw new ConflictException(ErrorMessages.PostUpdate);
      }
    }
    throw new NotFoundException(ErrorMessages.PostNotFound);
  }

  public async repost(id: string, repostBy: string): Promise<PostEntity> {
    const post = await this.postRepository.findById(id);
    if (post) {
      const { id, tags, ...rest } = post.toPlainData();

      return await this.postRepository.create({
        ...rest,
        isRepost: true,
        publishedAt: new Date(),
        publishedBy: repostBy,
      });
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

  public async delete(id: string, userId: string) {
    const post = await this.postRepository.findById(id);
    if (post) {
      const isOwnPost: boolean = !post.isRepost && post.createdBy === userId;
      const isRepost: boolean = post.isRepost && post.publishedBy === userId;

      if (isOwnPost || isRepost) {
        return void (await this.postRepository.delete(id));
      }
      throw new BadRequestException(ErrorMessages.PostDelete);
    }
    throw new NotFoundException(ErrorMessages.PostNotFound);
  }
}

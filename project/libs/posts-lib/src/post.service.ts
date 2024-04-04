import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { ErrorMessages, PostState } from '@project/core';
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
    const post = await this.postRepository.findById(id);
    if (post) {
      const postEntity = new PostEntity({ ...post.toPlainData(), ...dto });
      await this.postRepository.update(postEntity);
      return postEntity;
    }
    throw new NotFoundException(ErrorMessages.PostNotFound);
  }

  public async publish(id: string): Promise<PostEntity> {
    const post = await this.postRepository.findById(id);
    if (post) {
      const postEntity = new PostEntity({
        ...post.toPlainData(),
        state: PostState.Published,
      });
      await this.postRepository.update(postEntity);
      return postEntity;
    }
    throw new NotFoundException(ErrorMessages.PostNotFound);
  }

  public async repost(id: string, repostBy: string): Promise<PostEntity> {
    const post = await this.postRepository.findById(id);
    if (post) {
      const postEntity = new PostEntity({
        ...post.toPlainData(),
        isRepost: true,
        publishedAt: new Date().toISOString(),
        publishedBy: repostBy,
      });
      await this.postRepository.update(postEntity);
      return postEntity;
    }
    throw new NotFoundException(ErrorMessages.PostNotFound);
  }

  public async getPosts(usersIds: string[], tags?: string[]) {
    return this.postRepository.findPosts(usersIds, tags);
  }

  public async searchByTitle(title: string) {
    return this.postRepository.search(title);
  }

  public async getPost(id: string) {
    const post = this.postRepository.findById(id);

    if (post) return post;
    throw new NotFoundException(ErrorMessages.PostNotFound);
  }

  public async delete(id: string) {
    return this.postRepository.deleteById(id);
  }
}

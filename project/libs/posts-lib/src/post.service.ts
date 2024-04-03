import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dtos';
import { ErrorMessages } from '@project/core';
import { PostRepository } from './post.repository';
import { PostEntity } from './post.entity';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  public async create(dto: CreatePostDto): Promise<PostEntity> {
    const postEntity = new PostEntity(dto);
    await this.postRepository.save(postEntity);
    return postEntity;
  }

  public async update(dto: CreatePostDto): Promise<PostEntity> {
    const postEntity = new PostEntity(dto);
    await this.postRepository.update(postEntity);
    return postEntity;
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

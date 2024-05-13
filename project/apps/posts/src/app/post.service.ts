import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from '@project/posts-lib';
import { ERROR_MESSAGES, PaginationResult, PostState } from '@project/core';
import { PostRepository } from './post.repository';
import { PostEntity } from './post.entity';
import { fillDto } from '@project/helpers';
import { SearchPostsQuery } from '@project/posts-lib';

@Injectable()
export class PostService {
  constructor(private postRepository: PostRepository) {}

  public async create(userId: string, dto: CreatePostDto): Promise<PostEntity> {
    const postEntity = new PostEntity({ ...dto, createdBy: userId });
    return await this.postRepository.create(postEntity.toPlainData());
  }

  public async update(
    userId: string,
    id: string,
    dto: UpdatePostDto
  ): Promise<PostEntity> {
    const postEntity = await this.postRepository.findById(id);
    if (!postEntity) throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
    if (postEntity.createdBy !== userId)
      throw new BadRequestException(ERROR_MESSAGES.POST_UPDATE_OTHER_USERS);

    const payload = fillDto(UpdatePostDto, { ...dto, createdBy: userId });
    return await this.postRepository.adjust(id, payload);
  }

  public async publish(id: string, userId: string): Promise<PostEntity> {
    const postEntity = await this.postRepository.findById(id);
    if (!postEntity) throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
    if (postEntity.createdBy !== userId)
      throw new ConflictException(ERROR_MESSAGES.POST_UPDATE_OTHER_USERS);

    if (postEntity.state !== PostState.Draft)
      throw new BadRequestException(ERROR_MESSAGES.POST_PUBLISHED);

    return await this.postRepository.adjust(id, {
      createdBy: postEntity.createdBy,
      state: PostState.Published,
      publishedAt: new Date(),
      publishedBy: postEntity.createdBy,
    });
  }

  public async repost(postId: string, repostBy: string): Promise<PostEntity> {
    const post = await this.postRepository.findById(postId);
    if (!post) throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);

    const { id, tags, ...rest } = post.toPlainData();
    return this.postRepository.create({
      ...rest,
      isRepost: true,
      publishedAt: new Date(),
      publishedBy: repostBy,
    });
  }

  public search(args: SearchPostsQuery): Promise<PaginationResult<PostEntity>> {
    return this.postRepository.findPosts(args);
  }

  public findUsersPosts(usersIds: string[]): Promise<PostEntity[]> {
    return this.postRepository.findUsersPosts(usersIds);
  }

  public findPostsFromDate(date: Date): Promise<PostEntity[]> {
    return this.postRepository.findPostsFromDate(date);
  }

  public async getPost(id: string): Promise<PostEntity> {
    const post = this.postRepository.findById(id);
    if (!post) throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);
    return post;
  }

  public async getDrafts(
    userId: string
  ): Promise<PaginationResult<PostEntity>> {
    return this.postRepository.findPosts({
      usersIds: [userId],
      state: PostState.Draft,
    });
  }

  public async delete(id: string, userId: string): Promise<PostEntity> {
    const post = await this.postRepository.findById(id);
    if (!post) throw new NotFoundException(ERROR_MESSAGES.POST_NOT_FOUND);

    const isOwnPost: boolean = !post.isRepost && post.createdBy === userId;
    const isRepost: boolean = post.isRepost && post.publishedBy === userId;

    if (isOwnPost || isRepost) {
      return this.postRepository.delete(id);
    }
    throw new BadRequestException(ERROR_MESSAGES.POST_DELETE);
  }

  public count(userId: string): Promise<number> {
    return this.postRepository.getPostCount({ createdBy: userId });
  }
}

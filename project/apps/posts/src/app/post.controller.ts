import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ERROR_MESSAGES,
  SwaggerTags,
  PostType,
  SUCCESS_MESSAGES,
} from '@project/core';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { fillDto } from '@project/helpers';
import { FullPostRdo, PostRdo } from './rdos';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { PARSE_QUERY_ARRAY_PIPE_OPTIONS } from './post.constants';
import { PostPaths } from './post-paths.enum';

@ApiTags(SwaggerTags.Posts)
@Controller(PostPaths.Base)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(PostPaths.Search)
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: PostRdo,
    description: SUCCESS_MESSAGES.POSTS,
  })
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'userIds', required: false, type: Array<String> })
  @ApiQuery({
    name: 'types',
    required: false,
    type: String,
    isArray: true,
    enumName: 'PostType',
  })
  @ApiQuery({ name: 'tags', required: false, type: Array<String> })
  public async search(
    @Query('title') title?: string,
    @Query('userIds', new ParseArrayPipe(PARSE_QUERY_ARRAY_PIPE_OPTIONS))
    usersIds?: string[],
    @Query('types', new ParseArrayPipe(PARSE_QUERY_ARRAY_PIPE_OPTIONS))
    types?: PostType[],
    @Query('tags', new ParseArrayPipe(PARSE_QUERY_ARRAY_PIPE_OPTIONS)) // @TODO need to transform tags to get unique lowercase strings
    tags?: string[]
  ) {
    const posts = await this.postService.search({
      types,
      title,
      tags,
      usersIds,
    });
    return posts.map((post) => fillDto(PostRdo, post?.toPlainData()));
  }

  @Get(PostPaths.Drafts)
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostRdo,
    isArray: true,
    description: SUCCESS_MESSAGES.POSTS,
  })
  public async getDraftPosts(@Param('userId') userId: string) {
    // @TODO need to grab user id from token later
    const posts = await this.postService.getDrafts(userId);
    return posts.map((post) => fillDto(PostRdo, post?.toPlainData()));
  }

  @Get(PostPaths.Post)
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostRdo,
    description: SUCCESS_MESSAGES.POSTS,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.POST_NOT_FOUND,
  })
  public async getPostById(@Param('id') id: string) {
    const post = await this.postService.getPost(id);
    return fillDto(FullPostRdo, post?.toPlainData());
  }

  @Post(PostPaths.Create)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: PostRdo,
    description: SUCCESS_MESSAGES.POST_CREATED,
  })
  public async create(
    @Param('userId') userId: string,
    @Body() dto: CreatePostDto
  ) {
    // @TODO need to grab user id from token later
    const newPost = await this.postService.create(userId, dto);
    return fillDto(PostRdo, newPost.toPlainData());
  }

  @Put(PostPaths.Update)
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostRdo,
    description: SUCCESS_MESSAGES.POST_UPDATED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.POST_NOT_FOUND,
  })
  public async update(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePostDto
  ) {
    // @TODO need to grab user id from token
    const newPost = await this.postService.update(userId, id, dto);
    return fillDto(PostRdo, newPost.toPlainData());
  }

  @Put(PostPaths.Publish)
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostRdo,
    description: SUCCESS_MESSAGES.POST_PUBLISHED,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ERROR_MESSAGES.POST_UPDATED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.POST_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.POST_PUBLISHED,
  })
  public async publish(
    @Param('userId') userId: string,
    @Param('id') id: string
  ) {
    // @TODO need to grab user id from token
    const newPost = await this.postService.publish(id, userId);
    return fillDto(PostRdo, newPost.toPlainData());
  }

  @Post(PostPaths.Repost)
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostRdo,
    description: SUCCESS_MESSAGES.POST_REPOSTED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.POST_NOT_FOUND,
  })
  public async repost(
    @Param('userId') userId: string,
    @Param('id') id: string
  ) {
    // @TODO need to grab user id from token
    const newPost = await this.postService.repost(id, userId);
    return fillDto(PostRdo, newPost.toPlainData());
  }

  @Delete(PostPaths.Delete)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: SUCCESS_MESSAGES.POST_DELETED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.POST_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.POST_DELETED,
  })
  public async delete(
    @Param('userId') userId: string,
    @Param('id') id: string
  ) {
    // @TODO need to grab user id from token
    return await this.postService.delete(id, userId);
  }
}

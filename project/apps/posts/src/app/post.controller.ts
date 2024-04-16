import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ErrorMessages,
  SwaggerTags,
  PostState,
  PostType,
  RoutePaths,
  SuccessMessages,
} from '@project/core';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { fillDto } from '@project/helpers';
import { PostRdo } from './rdos';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';

@ApiTags(SwaggerTags.Posts)
@Controller(RoutePaths.Posts)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/')
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: PostRdo,
    description: SuccessMessages.Posts,
  })
  public async getPosts(
    @Query('usersIds') usersIds?: string[],
    @Query('tags') tags?: string[],
    @Query('type') type?: PostType[],
    @Query('state') state?: PostState
  ) {
    // const posts = await this.postService.getPosts(usersIds, tags, type, state);
    // return posts.map((post) => fillDto(PostRdo, post?.toPlainData()));
  }

  @Get('/search')
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: PostRdo,
    description: SuccessMessages.Posts,
  })
  public async search(@Query('title') title: string) {
    const posts = await this.postService.searchByTitle(title);
    return posts.map((post) => fillDto(PostRdo, post?.toPlainData()));
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostRdo,
    description: SuccessMessages.Posts,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.PostNotFound,
  })
  public async getPostById(@Param('id') id: string) {
    const post = await this.postService.getPost(id);
    return fillDto(PostRdo, post?.toPlainData());
  }

  @Post(':userId/create')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: PostRdo,
    description: SuccessMessages.PostCreated,
  })
  public async create(
    @Param('userId') userId: string,
    @Body() dto: CreatePostDto
  ) {
    // @TODO need to grab user id from token later
    const newPost = await this.postService.create(userId, dto);
    return fillDto(PostRdo, newPost.toPlainData());
  }

  @Put(':userId/update/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostRdo,
    description: SuccessMessages.PostUpdated,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.PostNotFound,
  })
  public async update(
    @Param('userId') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdatePostDto
  ) {
    const newPost = await this.postService.update(userId, id, dto);
    return fillDto(PostRdo, newPost.toPlainData());
  }

  @Put(':userId/publish/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostRdo,
    description: SuccessMessages.PostPublished,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ErrorMessages.PostUpdate,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.PostNotFound,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ErrorMessages.PostPublish,
  })
  public async publish(
    @Param('userId') userId: string,
    @Param('id') id: string
  ) {
    const newPost = await this.postService.publish(id, userId);
    return fillDto(PostRdo, newPost.toPlainData());
  }

  @Post(':userId/repost/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostRdo,
    description: SuccessMessages.PostReposted,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.PostNotFound,
  })
  public async repost(
    @Param('userId') userId: string,
    @Param('id') id: string
  ) {
    // @TODO need to grab user id from token
    const newPost = await this.postService.repost(id, userId);
    return fillDto(PostRdo, newPost.toPlainData());
  }

  @Delete(':userId/delete/:id')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: SuccessMessages.PostDeleted,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.PostNotFound,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ErrorMessages.PostDelete,
  })
  public async delete(
    @Param('userId') userId: string,
    @Param('id') id: string
  ) {
    return await this.postService.delete(id, userId);
  }
}

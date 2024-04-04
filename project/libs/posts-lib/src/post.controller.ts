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
  OpenApiTags,
  RoutePaths,
  SuccessMessages,
} from '@project/core';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { fillDto } from '@project/helpers';
import {
  BasePostRdo,
  PhotoPostRdo,
  QuotePostRdo,
  RefPostRdo,
  TextPostRdo,
  VideoPostRdo,
  withPostRdo,
} from './rdos';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';

@ApiTags(OpenApiTags.Posts)
@ApiExtraModels(
  TextPostRdo,
  PhotoPostRdo,
  VideoPostRdo,
  RefPostRdo,
  QuotePostRdo
)
@Controller(RoutePaths.Posts)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/')
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: BasePostRdo,
    description: SuccessMessages.Posts,
  })
  public async getUsersPosts(
    @Query('usersIds') usersIds: string[],
    @Query('tags') tags?: string[]
  ) {
    const posts = await this.postService.getPosts(usersIds, tags);
    return posts.map((post) =>
      fillDto(withPostRdo(post?.type), post?.toPlainData())
    );
  }

  @Get('/search')
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: BasePostRdo,
    description: SuccessMessages.Posts,
  })
  public async search(@Query('title') title: string) {
    const posts = await this.postService.searchByTitle(title);
    return posts.map((post) =>
      fillDto(withPostRdo(post?.type), post?.toPlainData())
    );
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: BasePostRdo,
    description: SuccessMessages.Posts,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.PostNotFound,
  })
  public async getPostById(@Param('id') id: string) {
    const post = await this.postService.getPost(id);
    return fillDto(withPostRdo(post?.type), post?.toPlainData());
  }

  @Post(':userId/create')
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: BasePostRdo,
    description: SuccessMessages.PostCreated,
  })
  public async create(
    @Param('userId') userId: string,
    @Body() dto: CreatePostDto
  ) {
    // @TODO need to grab user id from token later
    const newPost = await this.postService.create(userId, dto);
    return fillDto(withPostRdo(dto.type), newPost.toPlainData());
  }

  @Put('update/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: BasePostRdo,
    description: SuccessMessages.PostUpdated,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.PostNotFound,
  })
  public async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    const newPost = await this.postService.update(id, dto);
    return fillDto(withPostRdo(dto.type), newPost.toPlainData());
  }

  @Put('publish/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: BasePostRdo,
    description: SuccessMessages.PostPublished,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.PostNotFound,
  })
  public async publish(@Param('id') id: string) {
    const newPost = await this.postService.publish(id);
    return fillDto(withPostRdo(newPost.type), newPost.toPlainData());
  }

  @Put(':userId/repost/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: BasePostRdo,
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
    return fillDto(withPostRdo(newPost.type), newPost.toPlainData());
  }

  @Delete('delete/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    description: SuccessMessages.PostDeleted,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.PostNotFound,
  })
  public async delete(@Param('id') id: string) {
    return await this.postService.delete(id);
  }
}

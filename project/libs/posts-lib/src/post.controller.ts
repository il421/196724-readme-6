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
import { OpenApiTags, RoutePaths } from '@project/core';
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
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PostService } from './post.service';

@ApiTags(OpenApiTags.Posts)
@ApiExtraModels(
  BasePostRdo,
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
    schema: {
      $ref: getSchemaPath(BasePostRdo),
    },
  })
  public async getUsersPosts(
    @Query('usersIds') usersIds: string[],
    @Query('tags') tags?: string[]
  ) {
    // @TODO need to grab user id from token ??
    const posts = await this.postService.getPosts(usersIds, tags);
    return posts.map((post) =>
      fillDto(withPostRdo(post?.type), post?.toPlainData())
    );
  }

  @Get('/search')
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    schema: {
      $ref: getSchemaPath(BasePostRdo),
    },
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
    schema: {
      $ref: getSchemaPath(BasePostRdo),
    },
  })
  public async getPostById(@Param('id') id: string) {
    const post = await this.postService.getPost(id);
    return fillDto(withPostRdo(post?.type), post?.toPlainData());
  }

  @Post('create')
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      $ref: getSchemaPath(BasePostRdo),
    },
  })
  public async create(@Body() dto: CreatePostDto) {
    // @TODO need to grab user id from token
    const newPost = await this.postService.create(dto);
    return fillDto(withPostRdo(dto.type), newPost.toPlainData());
  }

  @Put('update/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(BasePostRdo),
    },
  })
  public async update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    // @TODO need to grab user id from token
    const newPost = await this.postService.update(id, dto);
    return fillDto(withPostRdo(dto.type), newPost.toPlainData());
  }

  @Put('publish/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(BasePostRdo),
    },
  })
  public async publish(@Param('id') id: string) {
    // @TODO need to grab user id from token
    const newPost = await this.postService.publish(id);
    return fillDto(withPostRdo(newPost.type), newPost.toPlainData());
  }

  @Put('repost/:id')
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(BasePostRdo),
    },
  })
  public async repost(@Param('id') id: string) {
    // @TODO need to grab user id from token
    const newPost = await this.postService.repost(id, '1');
    return fillDto(withPostRdo(newPost.type), newPost.toPlainData());
  }

  @Delete('delete')
  public async delete(@Param('id') id: string) {
    return await this.postService.delete(id);
  }
}

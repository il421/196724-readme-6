import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OpenApiTags, RoutePaths } from '@project/core';
import { CreatePostDto } from './dtos';
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
import { SubscriptionRdo } from '@project/subscriptions-lib';

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

  @Post('create')
  @ApiResponse({
    status: HttpStatus.CREATED,
    schema: {
      $ref: getSchemaPath(BasePostRdo),
    },
  })
  public async create(@Body() dto: CreatePostDto) {
    const newPost = await this.postService.create(dto);
    return fillDto(withPostRdo(dto.type), newPost.toPlainData());
  }

  @Put('update')
  @ApiResponse({
    status: HttpStatus.OK,
    schema: {
      $ref: getSchemaPath(BasePostRdo),
    },
  })
  public async update(@Body() dto: CreatePostDto) {
    const newPost = await this.postService.update(dto);
    return fillDto(withPostRdo(dto.type), newPost.toPlainData());
  }

  @Delete('delete')
  public async delete(@Param('id') id: string) {
    return await this.postService.delete(id);
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
}

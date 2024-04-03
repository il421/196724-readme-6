import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OpenApiTags, RoutePaths } from '@project/core';
import { CreatePostDto } from './dtos';
import { fillDto } from '@project/helpers';
import {
  PhotoPostRdo,
  QuotePostRdo,
  RefPostRdo,
  TextPostRdo,
  VideoPostRdo,
  withPostRdo,
} from './rdos';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
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

  @Post('create')
  public async create(@Body() dto: CreatePostDto) {
    const newPost = await this.postService.create(dto);
    return fillDto(withPostRdo(dto.type), newPost.toPlainData());
  }

  @Put('update')
  public async update(@Body() dto: CreatePostDto) {
    const newPost = await this.postService.update(dto);
    return fillDto(withPostRdo(dto.type), newPost.toPlainData());
  }

  @Delete('delete')
  public async delete(@Param('id') id: string) {
    return await this.postService.delete(id);
  }

  @Get(':id')
  public async getPostById(@Param('id') id: string) {
    const post = await this.postService.getPost(id);
    return fillDto(withPostRdo(post?.type), post?.toPlainData());
  }
}

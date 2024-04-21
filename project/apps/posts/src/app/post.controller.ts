import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  ParseArrayPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ERROR_MESSAGES,
  SWAGGER_TAGS,
  PostType,
  SUCCESS_MESSAGES,
  IHeaders,
  ITokenPayload,
} from '@project/core';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { fillDto, getToken } from '@project/helpers';
import { FullPostRdo, PostRdo } from './rdos';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { PARSE_QUERY_ARRAY_PIPE_OPTIONS } from './post.constants';
import { PostPaths } from './post-paths.enum';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '@project/data-access';

@ApiTags(SWAGGER_TAGS.POSTS)
@ApiBearerAuth()
@Controller(PostPaths.Base)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly jwtService: JwtService
  ) {}

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
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostRdo,
    isArray: true,
    description: SUCCESS_MESSAGES.POSTS,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public async getDraftPosts(@Headers() headers: IHeaders) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    const posts = await this.postService.getDrafts(sub);
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
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: PostRdo,
    description: SUCCESS_MESSAGES.POST_CREATED,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public async create(
    @Body() dto: CreatePostDto,
    @Headers() headers: IHeaders
  ) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    const newPost = await this.postService.create(sub, dto);
    return fillDto(PostRdo, newPost.toPlainData());
  }

  @Put(PostPaths.Update)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostRdo,
    description: SUCCESS_MESSAGES.POST_UPDATED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.POST_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public async update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Headers() headers: IHeaders
  ) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    const newPost = await this.postService.update(sub, id, dto);
    return fillDto(PostRdo, newPost.toPlainData());
  }

  @Put(PostPaths.Publish)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostRdo,
    description: SUCCESS_MESSAGES.POST_PUBLISHED,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ERROR_MESSAGES.POST_UPDATE_OTHER_USERS,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.POST_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.POST_PUBLISHED,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public async publish(@Param('id') id: string, @Headers() headers: IHeaders) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    const newPost = await this.postService.publish(id, sub);
    return fillDto(PostRdo, newPost.toPlainData());
  }

  @Post(PostPaths.Repost)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostRdo,
    description: SUCCESS_MESSAGES.POST_REPOSTED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.POST_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public async repost(@Param('id') id: string, @Headers() headers: IHeaders) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    const newPost = await this.postService.repost(id, sub);
    return fillDto(PostRdo, newPost.toPlainData());
  }

  @Delete(PostPaths.Delete)
  @UseGuards(JwtAuthGuard)
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
    description: ERROR_MESSAGES.POST_DELETE,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public delete(@Param('id') id: string, @Headers() headers: IHeaders) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    return this.postService.delete(id, sub);
  }
}

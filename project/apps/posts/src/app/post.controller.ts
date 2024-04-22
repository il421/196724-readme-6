import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ERROR_MESSAGES,
  SWAGGER_TAGS,
  SUCCESS_MESSAGES,
  IHeaders,
  ITokenPayload,
  SortDirection,
} from '@project/core';
import { CreatePostDto, UpdatePostDto } from './dtos';
import { fillDto, getToken } from '@project/helpers';
import { FullPostRdo, PostRdo } from './rdos';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import { PostPaths } from './post-paths.enum';
import { JwtService } from '@nestjs/jwt';
import { DtoValidationPipe, JwtAuthGuard } from '@project/data-access';
import { TagsTransformPipe } from './pipes';
import { CreatePostValidator, UpdatePostValidator } from './validator';
import { SearchPostsQuery } from './serach-post.query';
import { PostSearchQueryTransformPipe } from './pipes';
import { PARSE_QUERY_ARRAY_PIPE_OPTIONS } from './post.constants';

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
  @ApiQuery({ name: 'usersIds', required: false, type: Array<String> })
  @ApiQuery({
    name: 'types',
    required: false,
    type: String,
    isArray: true,
    enumName: 'PostType',
  })
  @ApiQuery({ name: 'tags', required: false, type: Array<String> })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Default is 25',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({
    name: 'sortDirection',
    required: false,
    type: String,
    enum: SortDirection,
  })
  public async search(
    @Query(PostSearchQueryTransformPipe)
    query?: SearchPostsQuery
  ) {
    const postsQueryResult = await this.postService.search(query);
    return {
      ...postsQueryResult,
      entities: postsQueryResult.entities.map((post) =>
        fillDto(PostRdo, post?.toPlainData())
      ),
    };
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
    const postsQueryResult = await this.postService.getDrafts(sub);
    return {
      ...postsQueryResult,
      entities: postsQueryResult.entities.map((post) =>
        fillDto(PostRdo, post?.toPlainData())
      ),
    };
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
    @Body(
      TagsTransformPipe,
      new DtoValidationPipe<CreatePostDto>(CreatePostValidator)
    )
    dto: CreatePostDto,
    @Headers() headers: IHeaders
  ) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    const payload = fillDto(CreatePostDto, dto);
    const newPost = await this.postService.create(sub, payload);
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
    @Body(
      TagsTransformPipe,
      new DtoValidationPipe<UpdatePostDto>(UpdatePostValidator)
    )
    dto: UpdatePostDto,
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

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
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ERROR_MESSAGES,
  SWAGGER_TAGS,
  SUCCESS_MESSAGES,
  SortDirection,
  RabbitRouting,
} from '@project/core';
import {
  CreatePostDto,
  UpdatePostDto,
  FullPostRdo,
  PostRdo,
} from '@project/posts-lib';
import { fillDto } from '@project/helpers';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PostService } from './post.service';
import {
  DtoValidationPipe,
  JwtAuthGuard,
  POST_PATHS,
} from '@project/data-access';
import {
  TagsTransformPipe,
  SearchPostsQuery,
  PostSearchQueryTransformPipe,
} from '@project/posts-lib';
import { CreatePostValidator, UpdatePostValidator } from './validator';

import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  CreatePostsNotificationDto,
  NotificationService,
  RABBIT_EXCHANGE,
} from '@project/notification-lib';
import { RequestWithUser } from '@project/users-lib';

@ApiTags(SWAGGER_TAGS.POSTS)
@ApiBearerAuth()
@Controller(POST_PATHS.BASE)
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly notificationService: NotificationService
  ) {}

  @Get(POST_PATHS.SEARCH)
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

  @Get(POST_PATHS.DRAFTS)
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
  public async getDraftPosts(@Req() { user }: RequestWithUser) {
    const postsQueryResult = await this.postService.getDrafts(user.id);
    return {
      ...postsQueryResult,
      entities: postsQueryResult.entities.map((post) =>
        fillDto(PostRdo, post?.toPlainData())
      ),
    };
  }

  @Get(POST_PATHS.POST)
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

  @Post(POST_PATHS.CREATE)
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
    @Req() { user }: RequestWithUser
  ) {
    const payload = fillDto(CreatePostDto, dto);
    const newPost = await this.postService.create(user.id, payload);
    return fillDto(PostRdo, newPost.toPlainData());
  }

  @Put(POST_PATHS.UPDATE)
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
    @Req() { user }: RequestWithUser
  ) {
    const newPost = await this.postService.update(user.id, id, dto);
    return fillDto(PostRdo, newPost.toPlainData());
  }

  @Put(POST_PATHS.PUBLISH)
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
  public async publish(
    @Param('id') id: string,
    @Req() { user }: RequestWithUser
  ) {
    const newPost = await this.postService.publish(id, user.id);
    return fillDto(PostRdo, newPost.toPlainData());
  }

  @Post(POST_PATHS.REPOST)
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
  public async repost(
    @Param('id') id: string,
    @Req() { user }: RequestWithUser
  ) {
    const newPost = await this.postService.repost(id, user.id);
    return fillDto(PostRdo, newPost.toPlainData());
  }

  @Delete(POST_PATHS.DELETE)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.OK,
    type: PostRdo,
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
  public async delete(
    @Param('id') id: string,
    @Req() { user }: RequestWithUser
  ) {
    const postEntity = await this.postService.delete(id, user.id);
    return fillDto(PostRdo, postEntity.toPlainData());
  }

  @Get(POST_PATHS.COUNT)
  @ApiResponse({
    status: HttpStatus.OK,
    type: Number,
    description: SUCCESS_MESSAGES.POST_USER_TOTAL,
  })
  public count(@Param('userId') userId: string) {
    return this.postService.count(userId);
  }

  @RabbitSubscribe({
    exchange: RABBIT_EXCHANGE,
    routingKey: RabbitRouting.ReceiveLatestPosts,
  })
  public async receiveLatestPosts(subscriber: CreatePostsNotificationDto) {
    const postsEntities = await this.postService.findPostsFromDate(
      subscriber.latestPostsEmailDate
    );

    const posts = postsEntities.map((post) =>
      fillDto(PostRdo, post?.toPlainData())
    );

    if (posts.length) {
      await this.notificationService.sendLatestPostsEmail({
        ...subscriber,
        posts,
      });
    }
  }
}

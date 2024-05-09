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
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiControllers } from './api-controllers.enum';
import { FEEDBACK_PATHS, POST_PATHS } from '@project/data-access';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ERROR_MESSAGES,
  IPaginationQuery,
  PaginationResult,
  PostType,
  ServicesUrls,
  SortDirection,
  SUCCESS_MESSAGES,
  SWAGGER_TAGS,
} from '@project/core';
import { AxiosExceptionFilter } from '../filters';
import { InjectAuthorizationHeaderInterceptor } from '@project/interceptors-lib';
import {
  CreatePostDto,
  PostRdo,
  SearchPostsQuery,
  UpdatePostDto,
} from '@project/posts-lib';
import { stringify } from 'query-string';
import { CommentRdo, CreateCommentDto } from '@project/feedback-lib';
import { FileRdo } from '@project/files-storage-lib';
import { UserRdo } from '@project/users-lib';

@Controller(ApiControllers.Posts)
@UseFilters(AxiosExceptionFilter)
@ApiTags(SWAGGER_TAGS.POSTS)
@ApiBearerAuth()
export class PostsController {
  constructor(
    private readonly httpService: HttpService,
    private apiConfig: ConfigService
  ) {}

  get serviceUrls() {
    return this.apiConfig.get<ServicesUrls>('http-client.serviceUrls');
  }

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
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Default is 1',
  })
  @ApiQuery({
    name: 'sortDirection',
    required: false,
    type: String,
    enum: SortDirection,
  })
  public async search(
    @Query()
    query: SearchPostsQuery
  ): Promise<PaginationResult<PostRdo>> {
    const queryRequest = stringify(query);

    const posts = (
      await this.httpService.axiosRef.get<PaginationResult<PostRdo>>(
        `${this.serviceUrls.posts}/${POST_PATHS.SEARCH}?${queryRequest}`
      )
    ).data;

    const { entities, ...restPost } = posts;
    const newEntities = await Promise.all(
      posts.entities.map(this.withExtraData)
    );
    return { ...restPost, entities: newEntities };
  }
  @Get(POST_PATHS.DRAFTS)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
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
  public async drafts(): Promise<PaginationResult<PostRdo>> {
    const posts = (
      await this.httpService.axiosRef.get<PaginationResult<PostRdo>>(
        `${this.serviceUrls.posts}/${POST_PATHS.DRAFTS}`
      )
    ).data;

    const { entities, ...restPost } = posts;
    const newEntities = await Promise.all(
      posts.entities.map(this.withExtraData)
    );
    return { ...restPost, entities: newEntities };
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
  public async getPost(@Param('id') id: string): Promise<PostRdo> {
    const post = (
      await this.httpService.axiosRef.get<PostRdo>(
        `${this.serviceUrls.posts}/${id}`
      )
    ).data;
    return this.withExtraData(post);
  }

  @Post(POST_PATHS.CREATE)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
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
    @Body()
    dto: CreatePostDto
  ): Promise<PostRdo> {
    const post = (
      await this.httpService.axiosRef.post<PostRdo>(
        `${this.serviceUrls.posts}/${POST_PATHS.CREATE}`,
        dto
      )
    ).data;
    return this.withExtraData(post);
  }

  @Put(POST_PATHS.UPDATE)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
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
    @Body()
    dto: UpdatePostDto
  ): Promise<PostRdo> {
    const post = (
      await this.httpService.axiosRef.put<PostRdo>(
        `${this.serviceUrls.posts}/update/${id}`,
        dto
      )
    ).data;
    return this.withExtraData(post);
  }

  @Put(POST_PATHS.PUBLISH)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
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
  public async publish(@Param('id') id: string): Promise<PostRdo> {
    const post = (
      await this.httpService.axiosRef.put<PostRdo>(
        `${this.serviceUrls.posts}/publish/${id}`
      )
    ).data;
    return this.withExtraData(post);
  }

  @Post(POST_PATHS.REPOST)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
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
  public async repost(@Param('id') id: string): Promise<PostRdo> {
    const post = (
      await this.httpService.axiosRef.post<PostRdo>(
        `${this.serviceUrls.posts}/repost/${id}`
      )
    ).data;
    return this.withExtraData(post);
  }

  @Delete(POST_PATHS.DELETE)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
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
  public async delete(@Param('id') id: string): Promise<void> {
    const deletedPost = (
      await this.httpService.axiosRef.delete<PostRdo>(
        `${this.serviceUrls.posts}/delete/${id}`
      )
    ).data;

    if (deletedPost.type === PostType.Photo && deletedPost.photoId) {
      await this.httpService.axiosRef.delete<PostRdo>(
        `${this.serviceUrls.filesStorage}/${deletedPost.photoId}/delete`
      );
    }
  }

  @Get(FEEDBACK_PATHS.COMMENTS)
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Default is 50',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    isArray: true,
    type: CommentRdo,
    description: SUCCESS_MESSAGES.COMMENTS,
  })
  public async getComments(
    @Param('postId') postId: string,
    @Query() query?: IPaginationQuery
  ): Promise<PaginationResult<CommentRdo>> {
    const queryRequest = stringify(query);

    return (
      await this.httpService.axiosRef.get<PaginationResult<CommentRdo>>(
        `${this.serviceUrls.feedback}/comments/${postId}?${queryRequest}`
      )
    ).data;
  }

  @Post(FEEDBACK_PATHS.COMMENT_CREATE)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: CommentRdo,
    description: SUCCESS_MESSAGES.COMMENT_CREATED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.POST_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public async createComment(
    @Body() dto: CreateCommentDto
  ): Promise<CommentRdo> {
    return (
      await this.httpService.axiosRef.post<CommentRdo>(
        `${this.serviceUrls.feedback}/${FEEDBACK_PATHS.COMMENT_CREATE}`,
        dto
      )
    ).data;
  }

  @Delete(FEEDBACK_PATHS.COMMENT_DELETE)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: SUCCESS_MESSAGES.COMMENT_DELETED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.COMMENT_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.COMMENT_OTHER_USERS_DELETE,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public async deleteComment(@Param('id') id: string): Promise<void> {
    return (
      await this.httpService.axiosRef.delete<void>(
        `${this.serviceUrls.feedback}/comments/${id}/delete`
      )
    ).data;
  }

  @Post(FEEDBACK_PATHS.LIKE_CREATE)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SUCCESS_MESSAGES.COMMENT_CREATED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.POST_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.POST_NOT_PUBLISHED,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.POST_ALREADY_LIKED,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public async likeComment(@Param('postId') postId: string): Promise<void> {
    return (
      await this.httpService.axiosRef.post<void>(
        `${this.serviceUrls.feedback}/likes/${postId}/create`
      )
    ).data;
  }

  @Delete(FEEDBACK_PATHS.LIKE_DELETE)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: SUCCESS_MESSAGES.COMMENT_DELETED,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.POST_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.POST_NOT_PUBLISHED,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public async unlikeComment(@Param('postId') postId: string): Promise<void> {
    return (
      await this.httpService.axiosRef.delete<void>(
        `${this.serviceUrls.feedback}/likes/${postId}/delete`
      )
    ).data;
  }

  private withExtraData = async (post: PostRdo): Promise<PostRdo> => {
    const user = await this.httpService.axiosRef.get<UserRdo>(
      `${this.serviceUrls.users}/${post.createdBy}`
    );

    const { photoId, ...restPost } = post;

    const dto = {
      ...restPost,
      authorEmail: user.data.email,
      authorFirstName: user.data.firstName,
      authorLastName: user.data.lastName,
    };

    if (post.type !== PostType.Photo || !photoId) return dto;
    const file = await this.httpService.axiosRef.get<FileRdo>(
      `${this.serviceUrls.filesStorage}/${post.photoId}`
    );

    return {
      ...dto,
      url: file.data.path,
    };
  };
}

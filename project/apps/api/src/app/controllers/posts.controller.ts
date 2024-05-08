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
  IPaginationQuery,
  PaginationResult,
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

    return (
      await this.httpService.axiosRef.get<PaginationResult<PostRdo>>(
        `${this.serviceUrls.posts}/${POST_PATHS.SEARCH}?${queryRequest}`
      )
    ).data;
  }
  @Get(POST_PATHS.DRAFTS)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  public async drafts(): Promise<PaginationResult<PostRdo>> {
    return (
      await this.httpService.axiosRef.get<PaginationResult<PostRdo>>(
        `${this.serviceUrls.posts}/${POST_PATHS.DRAFTS}`
      )
    ).data;
  }

  @Get(POST_PATHS.POST)
  public async getPost(@Param('id') id: string): Promise<PostRdo> {
    return (
      await this.httpService.axiosRef.get<PostRdo>(
        `${this.serviceUrls.posts}/${id}`
      )
    ).data;
  }

  @Post(POST_PATHS.CREATE)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  public async create(
    @Body()
    dto: CreatePostDto
  ): Promise<PostRdo> {
    return (
      await this.httpService.axiosRef.post<PostRdo>(
        `${this.serviceUrls.posts}/${POST_PATHS.CREATE}`,
        dto
      )
    ).data;
  }

  @Put(POST_PATHS.UPDATE)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  public async update(
    @Param('id') id: string,
    @Body()
    dto: UpdatePostDto
  ): Promise<PostRdo> {
    return (
      await this.httpService.axiosRef.put<PostRdo>(
        `${this.serviceUrls.posts}/update/${id}`,
        dto
      )
    ).data;
  }

  @Put(POST_PATHS.PUBLISH)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  public async publish(@Param('id') id: string): Promise<PostRdo> {
    return (
      await this.httpService.axiosRef.put<PostRdo>(
        `${this.serviceUrls.posts}/publish/${id}`
      )
    ).data;
  }

  @Post(POST_PATHS.REPOST)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  public async repost(@Param('id') id: string): Promise<PostRdo> {
    return (
      await this.httpService.axiosRef.post<PostRdo>(
        `${this.serviceUrls.posts}/repost/${id}`
      )
    ).data;
  }

  @Delete(POST_PATHS.DELETE)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  public async delete(@Param('id') id: string): Promise<PostRdo> {
    return (
      await this.httpService.axiosRef.delete<PostRdo>(
        `${this.serviceUrls.posts}/delete/${id}`
      )
    ).data;
  }

  @Get(FEEDBACK_PATHS.COMMENTS)
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Default is 50',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
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
  public async deleteComment(@Param('id') id: string): Promise<void> {
    return (
      await this.httpService.axiosRef.delete<void>(
        `${this.serviceUrls.feedback}/comments/${id}/delete`
      )
    ).data;
  }

  @Post(FEEDBACK_PATHS.LIKE_CREATE)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  public async likeComment(@Param('postId') postId: string): Promise<void> {
    return (
      await this.httpService.axiosRef.post<void>(
        `${this.serviceUrls.feedback}/likes/${postId}/create`
      )
    ).data;
  }

  @Delete(FEEDBACK_PATHS.LIKE_DELETE)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  public async unlikeComment(@Param('postId') postId: string): Promise<void> {
    return (
      await this.httpService.axiosRef.delete<void>(
        `${this.serviceUrls.feedback}/likes/${postId}/delete`
      )
    ).data;
  }
}

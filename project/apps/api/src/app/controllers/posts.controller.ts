import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { ApiControllers } from './api-controllers.enum';
import { POST_PATHS } from '@project/data-access';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  PaginationResult,
  ServicesUrls,
  SortDirection,
  SUCCESS_MESSAGES,
  SWAGGER_TAGS,
} from '@project/core';
import { AxiosExceptionFilter } from '../filters';
import { InjectAuthorizationHeaderInterceptor } from '@project/interceptors-lib';
import {
  PostRdo,
  PostSearchQueryTransformPipe,
  SearchPostsQuery,
} from '@project/posts-lib';
import { stringify } from 'query-string';

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
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
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
    @Query(PostSearchQueryTransformPipe)
    query: SearchPostsQuery
  ): Promise<PaginationResult<PostRdo>> {
    const queryRequest = stringify(query);

    return (
      await this.httpService.axiosRef.get<PaginationResult<PostRdo>>(
        `${this.serviceUrls.posts}/${POST_PATHS.SEARCH}?${queryRequest}`
      )
    ).data;
  }
}

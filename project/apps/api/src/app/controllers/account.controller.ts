import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserPasswordDto,
  UserRdo,
} from '@project/users-lib';
import { ConfigService } from '@nestjs/config';
import { ApiControllers } from './api-controllers.enum';
import {
  AUTHENTICATION_PATHS,
  POST_PATHS,
  SUBSCRIPTIONS_PATHS,
  USERS_PATHS,
} from '@project/data-access';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ServicesUrls, SWAGGER_TAGS } from '@project/core';
import { AxiosExceptionFilter } from '../filters';
import { InjectAuthorizationHeaderInterceptor } from '@project/interceptors-lib';
import { FileRdo } from '@project/files-storage-lib';
import {
  CreateSubscriptionDto,
  SubscriptionRdo,
} from '@project/subscriptions-lib';
import queryString from 'node:querystring';
import { PostRdo } from '@project/posts-lib';

@Controller(ApiControllers.Account)
@UseFilters(AxiosExceptionFilter)
@ApiTags(SWAGGER_TAGS.ACCOUNT)
@ApiBearerAuth()
export class AccountController {
  constructor(
    private readonly httpService: HttpService,
    private apiConfig: ConfigService
  ) {}

  get serviceUrls() {
    return this.apiConfig.get<ServicesUrls>('http-client.serviceUrls');
  }

  @Post(AUTHENTICATION_PATHS.CREATE)
  public async create(@Body() createUserDto: CreateUserDto): Promise<UserRdo> {
    return (
      await this.httpService.axiosRef.post(
        `${this.serviceUrls.auth}/${AUTHENTICATION_PATHS.CREATE}`,
        createUserDto
      )
    ).data;
  }

  @Post(AUTHENTICATION_PATHS.LOGIN)
  public async login(@Body() loginUserDto: LoginUserDto) {
    return (
      await this.httpService.axiosRef.post(
        `${this.serviceUrls.auth}/${AUTHENTICATION_PATHS.LOGIN}`,
        loginUserDto
      )
    ).data;
  }

  @Patch(AUTHENTICATION_PATHS.PASSWORD_UPDATE)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  public async updatePassword(
    @Body() updateUserPasswordDto: UpdateUserPasswordDto
  ) {
    return (
      await this.httpService.axiosRef.patch(
        `${this.serviceUrls.auth}/${AUTHENTICATION_PATHS.PASSWORD_UPDATE}`,
        updateUserPasswordDto
      )
    ).data;
  }

  @Patch(AUTHENTICATION_PATHS.REFRESH)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  public async refresh(@Body() loginUserDto: LoginUserDto) {
    return (
      await this.httpService.axiosRef.post(
        `${this.serviceUrls.auth}/${AUTHENTICATION_PATHS.REFRESH}`,
        loginUserDto
      )
    ).data;
  }

  @Post(USERS_PATHS.RECEIVE_LATEST_POSTS)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  public async receiveLatestPosts() {
    return (
      await this.httpService.axiosRef.post(
        `${this.serviceUrls.users}/${USERS_PATHS.RECEIVE_LATEST_POSTS}`
      )
    ).data;
  }

  @Get(SUBSCRIPTIONS_PATHS.BASE)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  public async subscriptions(): Promise<PostRdo[]> {
    const subscriptions = (
      await this.httpService.axiosRef.get<SubscriptionRdo[]>(
        this.serviceUrls.subscriptions
      )
    ).data;
    if (!subscriptions.length) {
      return [];
    }
    const authorsIds = subscriptions.map(
      (subscription) => subscription.authorId
    );
    const query = queryString.stringify({ usersIds: authorsIds });
    return (
      await this.httpService.axiosRef.get<PostRdo[]>(
        `${this.serviceUrls.posts}/${POST_PATHS.USERS}?${query}`
      )
    ).data;
  }

  @Post(SUBSCRIPTIONS_PATHS.CREATE_API)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  public async createSubscription(
    @Body() subscriptionDto: CreateSubscriptionDto
  ): Promise<SubscriptionRdo> {
    return (
      await this.httpService.axiosRef.post(
        `${this.serviceUrls.subscriptions}/${SUBSCRIPTIONS_PATHS.CREATE}`,
        subscriptionDto
      )
    ).data;
  }

  @Delete(SUBSCRIPTIONS_PATHS.DELETE_API)
  @UseInterceptors(InjectAuthorizationHeaderInterceptor)
  public async deleteSubscription(@Param('authorId') authorId: string) {
    return (
      await this.httpService.axiosRef.delete(
        `${this.serviceUrls.subscriptions}/${SUBSCRIPTIONS_PATHS.DELETE}/${authorId}`
      )
    ).data;
  }
  @Get(USERS_PATHS.DETAILS)
  public async find(@Param('id') id: string): Promise<UserRdo> {
    const [user, totalPosts] = await Promise.all([
      this.httpService.axiosRef.get<UserRdo>(`${this.serviceUrls.users}/${id}`),
      this.httpService.axiosRef.get<number>(
        `${this.serviceUrls.posts}/count/${id}`
      ),
    ]);

    if (user.data.avatarId) {
      const { avatarId, ...restUserDto } = user.data;
      const avatarUrl = await this.httpService.axiosRef.get<FileRdo>(
        `${this.serviceUrls.filesStorage}/${avatarId}`
      );
      return {
        ...restUserDto,
        posts: totalPosts.data,
        avatarUrl: avatarUrl.data.path,
      };
    }

    return { ...user.data, posts: totalPosts.data };
  }
}

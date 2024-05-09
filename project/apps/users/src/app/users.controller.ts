import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Patch,
  Body,
  UseGuards,
  Post,
  Req,
} from '@nestjs/common';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, SWAGGER_TAGS } from '@project/core';
import { fillDto } from '@project/helpers';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  RequestWithUser,
  UpdateUserAvatarDto,
  UpdateUserDto,
  UserRdo,
} from '@project/users-lib';
import { UsersService } from './users.service';
import {
  JwtAuthGuard,
  MongoIdValidationPipe,
  USERS_PATHS,
} from '@project/data-access';
import {
  CreatePostsNotificationDto,
  NotificationService,
} from '@project/notification-lib';

@ApiTags(SWAGGER_TAGS.USERS)
@ApiBearerAuth()
@Controller(USERS_PATHS.BASE)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService
  ) {}

  @Get(USERS_PATHS.USER)
  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: SUCCESS_MESSAGES.USER_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.USER_NOT_FOUND,
  })
  public async getUser(
    @Param('id', MongoIdValidationPipe)
    id: string
  ) {
    const user = await this.usersService.getUser(id);
    return fillDto(UserRdo, user?.toPlainData());
  }

  @Patch(USERS_PATHS.UPDATE_AVATAR)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: SUCCESS_MESSAGES.USER_AVATAR,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.USER_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public updateAvatar(
    @Body() dto: UpdateUserAvatarDto,
    @Req() { user }: RequestWithUser
  ) {
    return this.usersService.updateUser(user.id, { avatarId: dto.avatarId });
  }

  @Post(USERS_PATHS.RECEIVE_LATEST_POSTS)
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: SUCCESS_MESSAGES.USER_RECEIVED_EMAIL_POSTS,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.USER_NOT_FOUND,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public async receiveLatestPosts(@Req() { user }: RequestWithUser) {
    const userEntity = await this.usersService.getUser(user.id);
    const name: string = `${userEntity.firstName} ${userEntity.lastName}`;
    const payload: CreatePostsNotificationDto = {
      id: userEntity.id,
      name,
      email: userEntity.email,
      latestPostsEmailDate: userEntity.latestPostsEmailDate,
    };

    const isSent = await this.notificationService.receiveLatestPosts(payload);
    if (isSent)
      await this.usersService.updateUser(user.id, {
        latestPostsEmailDate: new Date(),
      });
  }
}

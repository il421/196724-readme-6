import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Patch,
  Body,
  UseGuards,
  Headers,
  Post,
} from '@nestjs/common';
import {
  ERROR_MESSAGES,
  IHeaders,
  ITokenPayload,
  SUCCESS_MESSAGES,
  SWAGGER_TAGS,
} from '@project/core';
import { fillDto, getToken } from '@project/helpers';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto, UserRdo } from '@project/users-lib';
import { UsersService } from './users.service';
import { USERS_PATHS } from './users.constants';
import { JwtAuthGuard } from '@project/data-access';
import { JwtService } from '@nestjs/jwt';
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
    private readonly jwtService: JwtService,
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
    @Param('id')
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
    @Body() dto: Pick<UpdateUserDto, 'avatarUrl'>,
    @Headers() headers: IHeaders
  ) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    return this.usersService.updateUser(sub, { avatarUrl: dto.avatarUrl });
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
  public async receiveLatestPosts(@Headers() headers: IHeaders) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));

    const user = await this.usersService.getUser(sub);
    const name: string = `${user.firstName} ${user.lastName}`;
    const payload: CreatePostsNotificationDto = {
      id: user.id,
      name,
      email: user.email,
      latestPostsEmailDate: user.latestPostsEmailDate,
    };

    const isSent = await this.notificationService.receiveLatestPosts(payload);
    if (isSent)
      await this.usersService.updateUser(sub, {
        latestPostsEmailDate: new Date(),
      });
  }
}

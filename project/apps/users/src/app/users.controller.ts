import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Patch,
  Body,
} from '@nestjs/common';
import { ERROR_MESSAGES, SUCCESS_MESSAGES, SwaggerTags } from '@project/core';
import { fillDto } from '@project/helpers';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserAvatarDto, UserRdo } from '@project/users-lib';
import { UsersService } from './users.service';
import { UsersPaths } from './users-paths.enum';

@ApiTags(SwaggerTags.Users)
@Controller(UsersPaths.Base)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(UsersPaths.User)
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

  @Patch(UsersPaths.UpdateAvatar)
  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: SUCCESS_MESSAGES.USER_AVATAR,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.USER_NOT_FOUND,
  })
  public async updateAvatar(
    @Param('id')
    id: string,
    @Body() dto: UpdateUserAvatarDto
  ) {
    // @TODO need to grab user id from token
    return await this.usersService.updateUserAvatar(id, dto.avatarId);
  }
}

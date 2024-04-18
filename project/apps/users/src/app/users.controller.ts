import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Patch,
  Body,
} from '@nestjs/common';
import {
  ERROR_MESSAGES,
  RoutePaths,
  SUCCESS_MESSAGES,
  SwaggerTags,
} from '@project/core';
import { fillDto } from '@project/helpers';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserAvatarDto, UserRdo } from '@project/users-lib';
import { UsersService } from './users.service';

@ApiTags(SwaggerTags.Users)
@Controller(RoutePaths.Users)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
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

  @Patch(':id/update-avatar')
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

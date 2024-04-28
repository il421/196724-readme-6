import {
  Controller,
  Get,
  Param,
  HttpStatus,
  Patch,
  Body,
  UseGuards,
  Headers,
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
import { UpdateUserAvatarDto, UserRdo } from '@project/users-lib';
import { UsersService } from './users.service';
import { USERS_PATHS } from './users.constants';
import { JwtAuthGuard } from '@project/data-access';
import { JwtService } from '@nestjs/jwt';

@ApiTags(SWAGGER_TAGS.USERS)
@ApiBearerAuth()
@Controller(USERS_PATHS.BASE)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
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
    @Body() dto: UpdateUserAvatarDto,
    @Headers() headers: IHeaders
  ) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    return this.usersService.updateUserAvatar(sub, dto.avatarUrl);
  }
}

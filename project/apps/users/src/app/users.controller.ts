import { Controller, Get, Param, HttpStatus } from '@nestjs/common';
import {
  ErrorMessages,
  RoutePaths,
  SuccessMessages,
  SwaggerTags,
} from '@project/core';
import { fillDto } from '@project/helpers';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserRdo } from '@project/users-lib';
import { UsersService } from './users.service';

@ApiTags(SwaggerTags.Users)
@Controller(RoutePaths.Users)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: SuccessMessages.UserFound,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.UserNotFound,
  })
  public async getUser(
    @Param('id')
    id: string
  ) {
    const user = await this.usersService.getUser(id);
    return fillDto(UserRdo, user?.toPlainData());
  }
}

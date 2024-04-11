import {
  Body,
  Controller,
  Param,
  Post,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import {
  ErrorMessages,
  SwaggerTags,
  RoutePaths,
  SuccessMessages,
} from '@project/core';
import { fillDto } from '@project/helpers';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  UserRdo,
  CreateUserDto,
  LoggedUserRdo,
  LoginUserDto,
  UpdateUserPasswordDto,
} from '@project/users-lib';
import { AuthenticationService } from './authentication.service';

@ApiTags(SwaggerTags.Auth)
@Controller(RoutePaths.Auth)
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}
  @Post('create')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SuccessMessages.UserCreate,
    type: UserRdo,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ErrorMessages.DuplicatedUser,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ErrorMessages.UserBadPassword,
  })
  public async create(
    @Body()
    dto: CreateUserDto
  ) {
    const newUser = await this.authService.register(dto);
    return fillDto(UserRdo, newUser.toPlainData());
  }

  @Post('login')
  @ApiResponse({
    type: LoggedUserRdo,
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ErrorMessages.UserBadPassword,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ErrorMessages.UserNotFound,
  })
  public async login(
    @Body()
    dto: LoginUserDto
  ) {
    await this.authService.verifyUser(dto);
    return fillDto(LoggedUserRdo, { accessToken: '123' }); // @TODO not completed
  }

  @Patch(':id/password/update')
  @ApiResponse({
    type: LoggedUserRdo,
    status: HttpStatus.OK,
    description: SuccessMessages.UserPasswordUpdated,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ErrorMessages.UserBadPassword,
  })
  public async updatePassword(
    @Param('id') id: string,
    @Body()
    dto: UpdateUserPasswordDto
  ) {
    await this.authService.updatePassword(id, dto);
    return fillDto(LoggedUserRdo, { accessToken: '123' }); // @TODO not completed
  }
}

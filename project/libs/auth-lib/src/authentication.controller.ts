import { Body, Controller, Get, Param, Post, HttpStatus } from '@nestjs/common';
import {
  ErrorMessages,
  OpenApiTags,
  RoutePaths,
  SuccessMessages,
} from '@project/core';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto, LoginUserDto } from './dtos';
import { fillDto } from '@project/helpers';
import { LoggedUserRdo, UserRdo } from './rdos';
import {
  ApiExtraModels,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { UpdateUserPasswordDto } from './dtos/update-user-password.dto';

@ApiTags(OpenApiTags.Auth)
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

  @Post(':id/password/update')
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
    const user = await this.authService.getUser(id);
    return fillDto(UserRdo, user?.toPlainData());
  }
}

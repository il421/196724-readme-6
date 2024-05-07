import {
  Body,
  Controller,
  Post,
  HttpStatus,
  Patch,
  UseGuards,
  UsePipes,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ERROR_MESSAGES, SWAGGER_TAGS, SUCCESS_MESSAGES } from '@project/core';
import { fillDto } from '@project/helpers';
import { ApiBearerAuth, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import {
  UserRdo,
  CreateUserDto,
  LoggedUserRdo,
  LoginUserDto,
  UpdateUserPasswordDto,
  CreateUserValidator,
  LoginUserValidator,
  PasswordUpdateValidator,
  RequestWithUser,
} from '@project/users-lib';
import { AuthenticationService } from './authentication.service';
import { AUTHENTICATION_PATHS } from './authentication.constants';
import {
  DtoValidationPipe,
  JwtAuthGuard,
  JwtRefreshGuard,
  LocalAuthGuard,
} from '@project/data-access';

@ApiTags(SWAGGER_TAGS.AUTH)
@ApiBearerAuth()
@Controller(AUTHENTICATION_PATHS.BASE)
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}
  @Post(AUTHENTICATION_PATHS.CREATE)
  @UsePipes(new DtoValidationPipe<CreateUserDto>(CreateUserValidator))
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: SUCCESS_MESSAGES.USER_CREATE,
    type: UserRdo,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: ERROR_MESSAGES.DUPLICATED_USER,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.USER_BAD_PASSWORD,
  })
  public async create(
    @Body()
    dto: CreateUserDto
  ) {
    const newUser = await this.authService.register(dto);
    return fillDto(UserRdo, newUser.toPlainData());
  }

  @Post(AUTHENTICATION_PATHS.LOGIN)
  @UseGuards(LocalAuthGuard)
  @UsePipes(new DtoValidationPipe<LoginUserDto>(LoginUserValidator))
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    type: LoggedUserRdo,
    status: HttpStatus.OK,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.USER_BAD_PASSWORD,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: ERROR_MESSAGES.USER_NOT_FOUND,
  })
  public async login(@Req() { user }: RequestWithUser) {
    const userToken = await this.authService.createUserToken(
      user.toPlainData()
    );
    return fillDto(LoggedUserRdo, {
      accessToken: userToken.accessToken,
      refreshToken: userToken.refreshToken,
    });
  }

  @Post(AUTHENTICATION_PATHS.REFRESH)
  @UseGuards(LocalAuthGuard)
  @UseGuards(JwtRefreshGuard)
  @ApiBody({ type: LoginUserDto })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: SUCCESS_MESSAGES.REFRESH_TOKEN,
  })
  public async refreshToken(@Req() { user }: RequestWithUser) {
    return this.authService.createUserToken(user.toPlainData());
  }

  @Patch(AUTHENTICATION_PATHS.PASSWORD_UPDATE)
  @UsePipes(
    new DtoValidationPipe<UpdateUserPasswordDto>(PasswordUpdateValidator)
  )
  @UseGuards(JwtAuthGuard)
  @ApiResponse({
    type: LoggedUserRdo,
    status: HttpStatus.NO_CONTENT,
    description: SUCCESS_MESSAGES.USER_PASSWORD_UPDATE,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: ERROR_MESSAGES.USER_BAD_PASSWORD,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: ERROR_MESSAGES.UNAUTHORIZED,
  })
  public async updatePassword(
    @Body() dto: UpdateUserPasswordDto,
    @Req() { user }: RequestWithUser
  ) {
    await this.authService.updatePassword(user.id, dto);
  }
}

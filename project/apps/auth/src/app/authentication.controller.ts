import {
  Body,
  Controller,
  Post,
  HttpStatus,
  Patch,
  UseGuards,
  UsePipes,
  Headers,
} from '@nestjs/common';
import {
  ERROR_MESSAGES,
  SWAGGER_TAGS,
  SUCCESS_MESSAGES,
  ITokenPayload,
  IHeaders,
} from '@project/core';
import { fillDto, getToken } from '@project/helpers';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  UserRdo,
  CreateUserDto,
  LoggedUserRdo,
  LoginUserDto,
  UpdateUserPasswordDto,
  CreateUserValidator,
  LoginUserValidator,
  PasswordUpdateValidator,
} from '@project/users-lib';
import { AuthenticationService } from './authentication.service';
import { AuthenticationPaths } from './authentication-paths.enum';
import { DtoValidationPipe, JwtAuthGuard } from '@project/data-access';
import { JwtService } from '@nestjs/jwt';

@ApiTags(SWAGGER_TAGS.AUTH)
@ApiBearerAuth()
@Controller(AuthenticationPaths.Base)
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly jwtService: JwtService
  ) {}
  @Post(AuthenticationPaths.Create)
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

  @Post(AuthenticationPaths.Login)
  @UsePipes(new DtoValidationPipe<LoginUserDto>(LoginUserValidator))
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
  public async login(
    @Body()
    dto: LoginUserDto
  ) {
    const user = await this.authService.verifyUser(dto);
    const userToken = await this.authService.createUserToken(
      user.toPlainData()
    );
    return fillDto(LoggedUserRdo, { accessToken: userToken.accessToken });
  }

  @Patch(AuthenticationPaths.PasswordUpdate)
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
    @Headers() headers: IHeaders
  ) {
    const { sub } = this.jwtService.decode<ITokenPayload>(getToken(headers));
    await this.authService.updatePassword(sub, dto);
  }
}

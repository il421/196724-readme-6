import {
  Body,
  Controller,
  Param,
  Post,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ERROR_MESSAGES, SWAGGER_TAGS, SUCCESS_MESSAGES } from '@project/core';
import { fillDto } from '@project/helpers';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  UserRdo,
  CreateUserDto,
  LoggedUserRdo,
  LoginUserDto,
  UpdateUserPasswordDto,
} from '@project/users-lib';
import { AuthenticationService } from './authentication.service';
import { AuthenticationPaths } from './authentication-paths.enum';
import { JwtAuthGuard } from '@project/data-access';

@ApiTags(SWAGGER_TAGS.AUTH)
@ApiBearerAuth()
@Controller(AuthenticationPaths.Base)
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}
  @Post(AuthenticationPaths.Create)
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
    @Param('id') id: string,
    @Body() dto: UpdateUserPasswordDto
  ) {
    await this.authService.updatePassword(id, dto);
  }
}

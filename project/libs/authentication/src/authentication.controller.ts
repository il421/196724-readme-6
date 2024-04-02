import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { OpenApiTags, RoutePaths } from '@project/core';
import { AuthenticationService } from './authentication.service';
import { CreateUserDto, LoginUserDto } from './dtos';
import { fillDto } from '@project/helpers';
import { LoggedUserRdo, UserRdo } from './rdos';
import {
  ApiExtraModels,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiTags(OpenApiTags.Auth)
@Controller(RoutePaths.Auth)
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('create')
  @ApiExtraModels(UserRdo)
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(UserRdo),
    },
  })
  public async create(@Body() dto: CreateUserDto) {
    const newUser = await this.authService.register(dto);
    return fillDto(UserRdo, newUser.toPlainData());
  }

  @Post('login')
  @ApiExtraModels(LoggedUserRdo)
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(LoggedUserRdo),
    },
  })
  public async login(@Body() dto: LoginUserDto) {
    const verifiedUser = await this.authService.verifyUser(dto);
    return fillDto(LoggedUserRdo, verifiedUser.toPlainData());
  }

  @Get(':id')
  @ApiExtraModels(UserRdo)
  @ApiResponse({
    schema: {
      $ref: getSchemaPath(UserRdo),
    },
  })
  public async getUserById(@Param('id') id: string) {
    const existUser = await this.authService.getUser(id);
    return fillDto(UserRdo, existUser.toPlainData());
  }
}

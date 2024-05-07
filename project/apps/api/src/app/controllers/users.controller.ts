import { Body, Controller, Post } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { LoginUserDto } from '@project/users-lib';
import { ConfigService } from '@nestjs/config';
import { ApiControllers } from './api-controllers.enum';
import { AUTHENTICATION_PATHS } from '@project/data-access';

@Controller(ApiControllers.Users)
export class UsersController {
  constructor(
    private readonly httpService: HttpService,
    private apiConfig: ConfigService
  ) {}

  get authBaseUrl() {
    return this.apiConfig.get<string>('http-client.servicesUrls.auth');
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${this.authBaseUrl}/${AUTHENTICATION_PATHS.LOGIN}`,
      loginUserDto
    );
    return data;
  }
}

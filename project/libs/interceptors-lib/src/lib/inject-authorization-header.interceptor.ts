import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AUTHORIZATION_HEADER } from './headers.constants';

@Injectable()
export class InjectAuthorizationHeaderInterceptor implements NestInterceptor {
  constructor(private httpService: HttpService) {}
  public intercept(context: ExecutionContext, next: CallHandler) {
    const ctx = context.switchToHttp();
    const authorization = ctx.getRequest().headers[AUTHORIZATION_HEADER];
    if (authorization) {
      this.httpService.axiosRef.defaults.headers.common[AUTHORIZATION_HEADER] =
        authorization;
    }

    return next.handle();
  }
}

import * as crypto from 'crypto';
import { Observable } from 'rxjs';
import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { REQUEST_ID_HEADER } from './request-id.constants';

export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const requestId = crypto.randomUUID();

    const request = context.switchToHttp().getRequest<Request>();
    request.headers.set(REQUEST_ID_HEADER, requestId);

    Logger.log(
      `[${request.method}: ${request.url}]: RequestID is ${requestId}`
    );
    return next.handle();
  }
}

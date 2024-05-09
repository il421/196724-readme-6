import * as crypto from 'crypto';
import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { REQUEST_ID_HEADER } from './headers.constants';

export class RequestIdInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const requestId = crypto.randomUUID();

    const request = context.switchToHttp().getRequest<Request>();
    request.headers[REQUEST_ID_HEADER] = requestId;

    Logger.log(
      `[${request.method}: ${request.url}]: RequestID is ${requestId}`
    );
    return next.handle();
  }
}

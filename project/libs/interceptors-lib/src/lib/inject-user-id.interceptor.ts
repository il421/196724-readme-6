import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class InjectUserIdInterceptor implements NestInterceptor {
  public intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    // @TODO probably to request
    // request["userId"] = request.user.sub;
    request.body['userId'] = request.user.sub;

    return next.handle();
  }
}

import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ERROR_MESSAGES, ITokenPayload } from '@project/core';
import { Strategies } from './strategies.enum';
import { UserEntity } from '@project/users-lib';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  Strategies.Jwt
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.accessTokenSecret'),
    });
  }

  public validate(payload: ITokenPayload): Pick<UserEntity, 'id'> {
    if (!payload.sub)
      throw new BadRequestException(ERROR_MESSAGES.TOKEN_INVALID);
    return { id: payload.sub };
  }
}

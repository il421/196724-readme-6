import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IRefreshTokenPayload } from '@project/core';
import { RefreshTokenService } from '@project/refresh-token-lib';
import { Strategies } from './strategies.enum';
import { TokenNotExistsException } from '../exeptions';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  Strategies.JwtRefresh
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly refreshTokenService: RefreshTokenService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.refreshTokenSecret'),
    });
  }

  public async validate(payload: IRefreshTokenPayload) {
    const isExists = await this.refreshTokenService.isExists(payload.tokenId);
    if (!isExists) {
      throw new TokenNotExistsException(payload.tokenId);
    }

    await this.refreshTokenService.deleteRefreshSession(payload.tokenId);
    await this.refreshTokenService.deleteExpiredRefreshTokens();

    return payload;
  }
}

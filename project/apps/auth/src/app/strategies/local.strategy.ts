import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';

import { AuthenticationService } from '../authentication.service';
import { USERNAME_FIELD_NAME } from '../authentication.constants';
import { UserEntity } from '@project/users-lib';
import { Strategies } from '@project/data-access';

@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  Strategies.Local
) {
  constructor(private readonly authService: AuthenticationService) {
    super({ usernameField: USERNAME_FIELD_NAME });
  }

  public validate(email: string, password: string): Promise<UserEntity> {
    return this.authService.verifyUser({ email, password });
  }
}

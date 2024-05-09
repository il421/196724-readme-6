import { Injectable } from '@nestjs/common';

import { RefreshTokenEntity } from './refresh-token.entity';
import { IEntityFactory, IJwtToken } from '@project/core';

@Injectable()
export class RefreshTokenFactory implements IEntityFactory<RefreshTokenEntity> {
  public create(entityPlainData: IJwtToken): RefreshTokenEntity {
    return new RefreshTokenEntity(entityPlainData);
  }
}

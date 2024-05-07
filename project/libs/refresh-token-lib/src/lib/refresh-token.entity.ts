import { Entity, IJwtToken, IStorableEntity } from '@project/core';

export class RefreshTokenEntity
  extends Entity
  implements IStorableEntity<IJwtToken>
{
  public tokenId?: string;
  public createdAt?: Date;
  public userId?: string;
  public expiresIn?: Date;

  constructor(token?: IJwtToken) {
    super();
    this.createdAt = token?.createdAt;
    this.tokenId = token?.tokenId;
    this.userId = token?.userId;
    this.expiresIn = token?.expiresIn;
  }

  public toPlainData(): IJwtToken {
    return {
      id: this.id,
      createdAt: this.createdAt,
      expiresIn: this.expiresIn,
      userId: this.userId,
      tokenId: this.tokenId,
    };
  }
}

import { Injectable } from '@nestjs/common';
import { MongoRepository } from '@project/data-access';
import { RefreshTokenEntity } from './refresh-token.entity';
import { RefreshTokenModel } from './refresh-token.model';
import { RefreshTokenFactory } from './refresh-token.factory';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RefreshTokenRepository extends MongoRepository<
  RefreshTokenEntity,
  RefreshTokenModel
> {
  constructor(
    entityFactory: RefreshTokenFactory,
    @InjectModel(RefreshTokenModel.name) blogUserModel: Model<RefreshTokenModel>
  ) {
    super(entityFactory, blogUserModel);
  }

  public async deleteByTokenId(tokenId: string) {
    return this.model.deleteOne({ tokenId }).exec();
  }

  public async findByTokenId(
    tokenId: string
  ): Promise<RefreshTokenEntity | null> {
    const refreshTokenDocument = await this.model.findOne({ tokenId }).exec();
    return this.createEntityFromDocument(refreshTokenDocument);
  }

  public async deleteExpiredTokens(): Promise<void> {
    this.model.deleteMany({ expiresIn: { $lt: new Date() } });
  }
}

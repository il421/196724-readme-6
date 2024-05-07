import {
  RefreshTokenFactory,
  RefreshTokenModel,
  RefreshTokenRepository,
  RefreshTokenSchema,
  RefreshTokenService,
} from '@project/refresh-token-lib';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RefreshTokenModel.name, schema: RefreshTokenSchema },
    ]),
  ],
  providers: [RefreshTokenService, RefreshTokenRepository, RefreshTokenFactory],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}

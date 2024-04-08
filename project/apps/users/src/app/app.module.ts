import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@project/auth-ib';
import {
  getMongooseOptions,
  UserModule,
  UsersConfigModule,
} from '@project/users-lib';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    AuthenticationModule,
    UserModule,
    UsersConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
  ],
})
export class AppModule {}

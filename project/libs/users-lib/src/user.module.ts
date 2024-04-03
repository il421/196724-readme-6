import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UserFactory } from './user.factory';

@Module({
  providers: [UserRepository, UserFactory],
  exports: [UserRepository],
})
export class UserModule {}

import { IEntityFactory, User } from '@project/core';
import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserFactory implements IEntityFactory<UserEntity> {
  public create(data: User): UserEntity {
    return new UserEntity(data);
  }
}

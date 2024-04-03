import { Entity, IStorableEntity, User } from '@project/core';
import { compare, genSalt, hash } from 'bcrypt';
import { SALT_ROUNDS } from './user.constants';

export class UserEntity extends Entity implements IStorableEntity<User> {
  public email?: string;
  public firstName?: string;
  public lastName?: string;
  public password?: string;
  public avatarUrl?: string;
  public createdAt?: string;
  constructor(user: User) {
    super();
    this.id = user.id;
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.avatarUrl = user.avatarUrl;
    this.createdAt = user.createdAt ?? new Date().toISOString();
  }

  toPlainData(): User {
    return {
      id: this.id,
      email: this.email ?? '',
      firstName: this.firstName ?? '',
      lastName: this.lastName ?? '',
      password: this.password ?? '',
      avatarUrl: this.avatarUrl ?? '',
      createdAt: this.createdAt,
    };
  }

  public async setPassword(password: string): Promise<UserEntity> {
    const salt = await genSalt(SALT_ROUNDS);
    this.password = await hash(password, salt);
    return this;
  }

  public async comparePassword(password: string): Promise<boolean> {
    if (!this.password) return false;
    return compare(password, this.password);
  }
}

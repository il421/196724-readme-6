import { Entity, IStorableEntity, User } from '@project/core';
import { compare, genSalt, hash } from 'bcrypt';
import { SALT_ROUNDS } from './user.constants';

export class UserEntity extends Entity implements IStorableEntity<User> {
  public email?: string;
  public firstName?: string;
  public lastName?: string;
  public password?: string;
  public avatarId?: string;
  public posts?: number;
  public followers?: number;
  public createdAt?: string;
  public avatarUrl?: string;
  constructor(user: User) {
    super();
    this.id = user.id;
    this.email = user.email;
    this.password = user.password;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.avatarId = user.avatarId;
    this.avatarUrl = user.avatarUrl;
    this.posts = user.posts;
    this.followers = user.followers;
    this.createdAt = user.createdAt;
  }

  toPlainData(): User {
    return {
      id: this.id,
      email: this.email ?? '',
      firstName: this.firstName ?? '',
      lastName: this.lastName ?? '',
      password: this.password ?? '',
      avatarId: this.avatarId,
      avatarUrl: this.avatarUrl,
      posts: this.posts ?? 0,
      followers: this.followers ?? 0,
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

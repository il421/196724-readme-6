import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity, UserRepository } from '@project/users-lib';
import { ERROR_MESSAGES } from '@project/core';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getUser(id: string) {
    const userEntity = await this.userRepository.searchById(id);
    if (!userEntity) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    return userEntity;
  }

  public async updateUserAvatar(id: string, avatarUrl: string) {
    const userEntity = await this.userRepository.findById(id);
    if (!userEntity) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);

    const newUserEntity = new UserEntity({
      ...userEntity.toPlainData(),
      avatarUrl,
    });
    return await this.userRepository.update(newUserEntity);
  }
}

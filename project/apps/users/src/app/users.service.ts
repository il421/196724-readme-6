import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity, UserRepository } from '@project/users-lib';
import { ErrorMessages } from '@project/core';
import mongoose from 'mongoose';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getUser(id: string) {
    const userEntity = await this.userRepository.findById(id);
    if (userEntity) {
      return userEntity;
    }

    throw new NotFoundException(ErrorMessages.UserNotFound);
  }

  public async updateUserAvatar(id: string, avatarId: string) {
    const userEntity = await this.userRepository.findById(id);

    if (userEntity) {
      const newUserEntity = new UserEntity({
        ...userEntity.toPlainData(),
        avatarId,
      });
      return await this.userRepository.update(newUserEntity);
    }
    throw new NotFoundException(ErrorMessages.UserNotFound);
  }
}

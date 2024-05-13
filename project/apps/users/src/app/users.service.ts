import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto, UserEntity, UserRepository } from '@project/users-lib';
import { ERROR_MESSAGES } from '@project/core';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getUser(id: string) {
    const userEntity = await this.userRepository.searchById(id);
    if (!userEntity) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    return userEntity;
  }

  public async updateUser(id: string, update: UpdateUserDto) {
    const userEntity = await this.userRepository.findById(id);
    if (!userEntity) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);

    const newUserEntity = new UserEntity({
      ...userEntity.toPlainData(),
      ...update,
    });
    return this.userRepository.update(newUserEntity);
  }
}

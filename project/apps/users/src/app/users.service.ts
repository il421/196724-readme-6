import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity, UserRepository } from '@project/users-lib';
import { ErrorMessages } from '@project/core';
import { FilesStorageService } from '@project/files-storage-lib';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly filesStorageService: FilesStorageService
  ) {}

  public async getUser(id: string) {
    const userEntity = await this.userRepository.findById(id);
    if (userEntity) {
      if (userEntity?.avatarId) {
        const avatarEntity = await this.filesStorageService.findById(
          userEntity.avatarId
        );

        return new UserEntity({
          ...userEntity.toPlainData(),
          avatarUrl: avatarEntity?.path,
        });
      }
      return userEntity;
    }

    throw new NotFoundException(ErrorMessages.UserNotFound);
  }
}

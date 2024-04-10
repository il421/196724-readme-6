import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '@project/users-lib';
import { SwaggerErrorMessages } from '@project/core';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getUser(id: string) {
    const user = this.userRepository.findById(id);
    if (user) {
      return user;
    }
    throw new NotFoundException(SwaggerErrorMessages.UserNotFound);
  }
}

import {
  ConflictException,
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity, UserRepository } from '@project/users-lib';
import { ErrorMessages } from '@project/core';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserPasswordDto,
} from '@project/users-lib';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userRepository: UserRepository) {}

  public async register(dto: CreateUserDto): Promise<UserEntity> {
    const { email, firstName, lastName, password } = dto;

    if (!email || !password || !firstName || !lastName) {
      throw new BadRequestException(ErrorMessages.NoEmailOrPassword);
    }

    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new ConflictException(ErrorMessages.DuplicatedUser);
    }

    const userEntity = await new UserEntity(dto).setPassword(password);
    await this.userRepository.save(userEntity);
    return userEntity;
  }

  public async verifyUser(dto: LoginUserDto) {
    const { email, password } = dto;
    const existUser = await this.userRepository.findByEmail(email);

    if (!existUser) {
      throw new NotFoundException(ErrorMessages.UserNotFound);
    }

    if (!password || !(await existUser.comparePassword(password))) {
      throw new UnauthorizedException(ErrorMessages.UserBadPassword);
    }

    return existUser;
  }

  public async updatePassword(id: string, payload: UpdateUserPasswordDto) {
    const user = await this.userRepository.findById(id);
    if (user) {
      if (
        !payload.password ||
        !(await user.comparePassword(payload.password))
      ) {
        throw new UnauthorizedException(ErrorMessages.UserBadPassword);
      }
      const userEntity = await new UserEntity(user.toPlainData()).setPassword(
        payload.newPassword
      );
      return await this.userRepository.update(userEntity);
    }
    throw new NotFoundException(ErrorMessages.UserNotFound);
  }
}

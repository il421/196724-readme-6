import {
  ConflictException,
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { UserEntity, UserRepository } from '@project/user';
import { CreateUserDto, LoginUserDto } from './dtos';
import { ErrorMessages } from '@project/core';

@Injectable()
export class AuthenticationService {
  constructor(private readonly userRepository: UserRepository) {}

  public async register(dto: CreateUserDto): Promise<UserEntity> {
    const { email, firstName, lastName, password } = dto;

    if (!email || !password || !firstName || !lastName) {
      throw new BadRequestException(ErrorMessages.NoEmailOrPassword);
    }

    const user = {
      email,
      firstName,
      lastName,
      password: '',
    };

    const existUser = await this.userRepository.findByEmail(email);

    if (existUser) {
      throw new ConflictException(ErrorMessages.DuplicatedUser);
    }

    const userEntity = await new UserEntity(user).setPassword(password);
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

  public async getUser(id: string) {
    return this.userRepository.findById(id);
  }
}

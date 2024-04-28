import {
  ConflictException,
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserEntity, UserRepository } from '@project/users-lib';
import { ERROR_MESSAGES, IToken, ITokenPayload, User } from '@project/core';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserPasswordDto,
} from '@project/users-lib';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  public async register(dto: CreateUserDto): Promise<UserEntity> {
    const { email, firstName, lastName, password } = dto;

    if (!email || !password || !firstName || !lastName) {
      throw new BadRequestException(ERROR_MESSAGES.NO_EMAIL_OR_PASSWORD);
    }

    const user = await this.userRepository.findByEmail(email);
    if (user) throw new ConflictException(ERROR_MESSAGES.DUPLICATED_USER);

    const userEntity = new UserEntity(dto);
    await userEntity.setPassword(password);
    await this.userRepository.save(userEntity);
    return userEntity;
  }

  public async verifyUser(dto: LoginUserDto) {
    const { email, password } = dto;
    const existUser = await this.userRepository.findByEmail(email);

    if (!existUser) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);
    if (!password || !(await existUser.comparePassword(password)))
      throw new UnauthorizedException(ERROR_MESSAGES.USER_BAD_PASSWORD);

    return existUser;
  }

  public async updatePassword(id: string, payload: UpdateUserPasswordDto) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundException(ERROR_MESSAGES.USER_NOT_FOUND);

    if (!payload.password || !(await user.comparePassword(payload.password))) {
      throw new UnauthorizedException(ERROR_MESSAGES.USER_BAD_PASSWORD);
    }
    const userEntity = new UserEntity(user.toPlainData());
    await userEntity.setPassword(payload.newPassword);
    return await this.userRepository.update(userEntity);
  }

  public async createUserToken(user: User): Promise<IToken> {
    const payload: ITokenPayload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    try {
      const accessToken = await this.jwtService.signAsync(payload);
      return { accessToken };
    } catch (error) {
      throw new HttpException(
        ERROR_MESSAGES.TOKEN,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

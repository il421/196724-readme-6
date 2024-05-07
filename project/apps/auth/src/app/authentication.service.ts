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
import { ERROR_MESSAGES, IToken, User } from '@project/core';
import {
  CreateUserDto,
  LoginUserDto,
  UpdateUserPasswordDto,
} from '@project/users-lib';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '@project/refresh-token-lib';
import { createJWTPayload } from '@project/helpers';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService
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
    const accessTokenPayload = createJWTPayload(user);
    const refreshTokenPayload = {
      ...accessTokenPayload,
      tokenId: crypto.randomUUID(),
    };
    await this.refreshTokenService.createRefreshSession(refreshTokenPayload);

    try {
      const accessToken = await this.jwtService.signAsync(accessTokenPayload);
      const refreshToken = await this.jwtService.signAsync(refreshTokenPayload);
      return { accessToken, refreshToken };
    } catch (error) {
      throw new HttpException(
        ERROR_MESSAGES.TOKEN_CREATE,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

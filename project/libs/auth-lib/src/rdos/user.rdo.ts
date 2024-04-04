import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserRdo {
  @ApiProperty({
    description: 'Unique identification',
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
  })
  @Expose()
  readonly id!: string;

  @ApiProperty({
    description: 'Unique email',
    example: 'example@mail.com',
  })
  @Expose()
  readonly email!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Ilya',
  })
  @Expose()
  readonly firstName!: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Suglobov',
  })
  @Expose()
  readonly lastName!: string;

  @ApiProperty({
    description: 'User avatar url',
    example: 'https://avatars.githubusercontent.com/u/a.png',
  })
  @Expose()
  avatarUrl?: string;

  @ApiProperty({
    description: 'Number of personal post',
    example: 10,
  })
  @Expose()
  posts!: number;

  @ApiProperty({
    description: 'Number of user followers',
    example: 3,
  })
  @Expose()
  followers!: number;

  @ApiProperty({
    description: 'User liked posts ids',
    example: '[1, 2, 4]',
  })
  @Expose()
  likedPosts!: string[];

  @ApiProperty({
    description: 'Data of user registration',
    example: '2012-12-12',
  })
  @Expose()
  createdAt!: string;
}

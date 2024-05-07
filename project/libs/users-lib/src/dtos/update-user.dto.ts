import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Unique email',
    example: 'example@mail.com',
  })
  public email?: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Ilya',
  })
  public firstName?: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Suglobov',
  })
  public lastName?: string;

  @ApiProperty({
    description: 'Avatar path',
    example: 'https://docs.nestjs.com/openapi/introduction',
  })
  public avatarUrl?: string;

  @ApiProperty({
    description: 'Last newsletter data',
    example: '2001-01-12',
  })
  public latestPostsEmailDate?: Date;
}

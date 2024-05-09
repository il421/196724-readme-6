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
    description: 'Avatar ID (reference)',
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
  })
  public avatarId?: string;

  @ApiProperty({
    description: 'Last newsletter data',
    example: '2001-01-12',
  })
  public latestPostsEmailDate?: Date;
}

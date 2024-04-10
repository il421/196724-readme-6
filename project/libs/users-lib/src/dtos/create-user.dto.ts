import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Unique email',
    example: 'example@mail.com',
  })
  public email!: string;

  @ApiProperty({
    description: 'User first name',
    example: 'Ilya',
  })
  public firstName!: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Suglobov',
  })
  public lastName!: string;

  @ApiProperty({
    description: 'User system password',
    example: '123qwe!ASD#',
  })
  public password!: string;
}

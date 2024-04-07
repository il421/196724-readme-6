import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'Unique email',
    example: 'example@mail.com',
  })
  public email!: string;

  @ApiProperty({
    description: 'User system password',
    example: '123qwe!ASD#',
  })
  public password!: string;
}

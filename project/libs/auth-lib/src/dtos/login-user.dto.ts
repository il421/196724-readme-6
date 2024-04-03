import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty()
  public email!: string;

  @ApiProperty()
  public password!: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  public email!: string;

  @ApiProperty()
  public firstName!: string;

  @ApiProperty()
  public lastName!: string;

  @ApiProperty()
  public password!: string;
}

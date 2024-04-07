import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserPasswordDto {
  @ApiProperty({
    description: 'Current user system password',
    example: '123qwe!ASD#',
  })
  public password!: string;

  @ApiProperty({
    description: 'New user system password',
    example: '123qwe!ASD#',
  })
  public newPassword!: string;
}

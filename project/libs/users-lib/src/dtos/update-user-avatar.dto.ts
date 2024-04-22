import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserAvatarDto {
  @ApiProperty({
    description: 'Avatar path',
    example: 'https://docs.nestjs.com/openapi/introduction',
  })
  public avatarUrl!: string;
}

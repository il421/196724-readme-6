import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserAvatarDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
  })
  public fileId!: string;
}

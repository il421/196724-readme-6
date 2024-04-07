import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
  @ApiProperty({
    description: 'Blog author identifier',
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
  })
  public authorId!: string;
}

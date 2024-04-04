import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionRdo {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
  })
  @Expose()
  readonly id!: string;

  @ApiProperty({
    description: 'Blog author identifier',
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
  })
  @Expose()
  readonly authorId!: string;

  @ApiProperty({
    description: 'Blog author identifier',
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
  })
  @Expose()
  readonly createdBy!: string;

  @ApiProperty({
    description: 'Create subscription date',
    example: '2021-11-11',
  })
  @Expose()
  readonly createdAt!: string;
}

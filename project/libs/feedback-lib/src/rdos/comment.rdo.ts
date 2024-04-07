import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CommentRdo {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
  })
  @Expose()
  readonly id!: string;

  @ApiProperty({
    description: 'Unique post identifier',
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
  })
  @Expose()
  readonly postId!: string;

  @ApiProperty({
    description: 'Comment text',
    example: 'My perfect comment',
  })
  @Expose()
  readonly text!: string;

  @ApiProperty({
    description: 'Comment author identifier',
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
  })
  @Expose()
  readonly createdBy!: string;

  @ApiProperty({
    description: 'Comment publishing date',
    example: '2012-12-02',
  })
  @Expose()
  readonly createdAt!: string;
}

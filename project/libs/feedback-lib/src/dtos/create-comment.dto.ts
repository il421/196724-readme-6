import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Comment text',
    example: 'My perfect comment',
  })
  public text!: string;

  @ApiProperty({
    description: 'Unique post identifier',
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
  })
  public postId!: string;
}

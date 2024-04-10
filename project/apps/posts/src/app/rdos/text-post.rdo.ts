import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BasePostRdo } from './base-post.rdo';

export class TextPostRdo extends BasePostRdo {
  @ApiProperty({
    example: 'My perfect post announcement',
    description: 'Post announcement',
  })
  @Expose()
  readonly announcement!: string;

  @ApiProperty({
    example: 'My perfect post text',
    description: 'Post text',
  })
  @Expose()
  readonly text!: string;
}

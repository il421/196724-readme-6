import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BasePostRdo } from './base-post.rdo';

export class QuotePostRdo extends BasePostRdo {
  @ApiProperty({
    example: 'Ilya Suglobov',
    description: 'Post quote author',
  })
  @Expose()
  readonly quoteAuthor!: string;

  @ApiProperty({
    example: 'My perfect post text',
    description: 'Post text',
  })
  @Expose()
  readonly text!: string;
}

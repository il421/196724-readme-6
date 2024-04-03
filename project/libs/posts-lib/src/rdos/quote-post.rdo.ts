import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BasePostRdo } from './base-post.rdo';

export class QuotePostRdo extends BasePostRdo {
  @ApiProperty()
  @Expose()
  readonly quoteAuthor!: string;

  @ApiProperty()
  @Expose()
  readonly text!: string;
}

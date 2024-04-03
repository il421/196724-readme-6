import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BasePostRdo } from './base-post.rdo';

export class TextPostRdo extends BasePostRdo {
  @ApiProperty()
  @Expose()
  readonly announcement!: string;

  @ApiProperty()
  @Expose()
  readonly text!: string;
}

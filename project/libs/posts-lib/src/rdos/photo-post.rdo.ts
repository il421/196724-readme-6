import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BasePostRdo } from './base-post.rdo';

export class PhotoPostRdo extends BasePostRdo {
  @ApiProperty()
  @Expose()
  readonly url!: string;
}

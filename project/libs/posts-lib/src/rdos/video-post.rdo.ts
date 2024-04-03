import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BasePostRdo } from './base-post.rdo';

export class VideoPostRdo extends BasePostRdo {
  @ApiProperty()
  @Expose()
  readonly url!: string;
}

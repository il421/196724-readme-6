import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BasePostRdo } from './base-post.rdo';

export class PhotoPostRdo extends BasePostRdo {
  @ApiProperty({
    example: 'https://docs.nestjs.com/openapi/introduction',
    description: 'Post link url',
  })
  @Expose()
  readonly url!: string;
}

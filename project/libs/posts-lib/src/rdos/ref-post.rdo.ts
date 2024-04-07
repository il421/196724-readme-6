import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BasePostRdo } from './base-post.rdo';

export class RefPostRdo extends BasePostRdo {
  @ApiProperty({
    example: 'https://docs.nestjs.com/openapi/introduction',
    description: 'Post link url',
  })
  @Expose()
  readonly url!: string;

  @ApiProperty({
    example: 'My perfect reference post description',
    description: 'Post description',
  })
  @Expose()
  readonly description!: string;
}

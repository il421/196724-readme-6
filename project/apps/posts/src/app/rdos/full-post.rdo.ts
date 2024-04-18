import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PostRdo } from './post.rdo';

export class FullPostRdo extends PostRdo {
  @ApiProperty({
    description: 'Flag to show if a post is reposted',
    example: true,
  })
  @Expose()
  isRepost!: boolean;
}

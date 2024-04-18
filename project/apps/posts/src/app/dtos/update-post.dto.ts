import { ApiProperty } from '@nestjs/swagger';
import { PostState } from '@project/core';
import { CreatePostDto } from './create-post.dto';
import { Expose } from 'class-transformer';

export class UpdatePostDto extends CreatePostDto {
  @ApiProperty({
    enum: PostState,
    enumName: 'PostState',
    example: 'published',
    description: 'Post state',
  })
  @Expose()
  public state!: PostState;
}

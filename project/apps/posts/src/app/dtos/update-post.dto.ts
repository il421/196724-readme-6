import { ApiProperty } from '@nestjs/swagger';
import { PostState } from '@project/core';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends CreatePostDto {
  @ApiProperty({
    enum: PostState,
    enumName: 'PostState',
    example: 'published',
    description: 'Post state',
  })
  public state!: PostState;
}

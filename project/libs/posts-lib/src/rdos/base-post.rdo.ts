import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PostState, PostTypes, Tag } from '@project/core';

export class BasePostRdo {
  @ApiProperty({
    description: 'Unique identification',
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
  })
  @Expose()
  readonly id!: string;

  @ApiProperty({
    description: 'Post title',
    example: 'My first post',
  })
  @Expose()
  readonly title!: string;

  @ApiProperty({
    enum: PostTypes,
    enumName: 'PostTypes',
    description: 'Post type',
    example: 'video',
  })
  @Expose()
  readonly type!: PostTypes;

  @ApiProperty({
    enum: PostState,
    enumName: 'PostState',
    description: 'Post state',
    example: 'published',
  })
  @Expose()
  readonly state!: PostState;

  @ApiProperty({
    description: 'Flag to show if the post has been reposted',
    example: 'true',
  })
  @Expose()
  readonly isRepost!: boolean;

  @ApiProperty()
  @Expose()
  readonly tags!: Tag[];

  @ApiProperty()
  @Expose()
  readonly createdBy!: string;

  @ApiProperty()
  @Expose()
  readonly createdAt!: string;

  @ApiProperty()
  @Expose()
  readonly publishedBy!: string;

  @ApiProperty()
  @Expose()
  readonly publishedAt!: string;
}

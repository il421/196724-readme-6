import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PostState, PostTypes } from '@project/core';

export class BasePostRdo {
  @ApiProperty({
    description: 'Unique identification',
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
  })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'My new post', description: 'Post title' })
  @Expose()
  title!: string;

  @ApiProperty({
    enum: PostTypes,
    enumName: 'PostTypes',
    example: 'video',
    description: 'Post type',
  })
  @Expose()
  type!: PostTypes;

  @ApiProperty({
    enum: PostState,
    enumName: 'PostState',
    example: 'published',
    description: 'Post state',
  })
  @Expose()
  state!: PostState;

  @ApiProperty({
    description: 'Flag to show if a post is reposted',
    example: true,
  })
  @Expose()
  isRepost!: boolean;

  @ApiProperty({ example: '[personal, business]', description: 'Post tags' })
  @Expose()
  tags!: string[];

  @ApiProperty({
    example: '[c3c05894-c1a9-422d-8752-4dc83b27b7b3]',
    description: 'Post liked users',
  })
  @Expose()
  liked!: string[];

  @ApiProperty({
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
    description: 'Post author identification',
  })
  @Expose()
  createdBy!: string;

  @ApiProperty({
    example: '2012-12-22',
    description: 'Post create data',
  })
  @Expose()
  createdAt!: string;

  @ApiProperty({
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
    description: 'Post publisher identification',
  })
  @Expose()
  publishedBy!: string;

  @ApiProperty({
    example: '2012-12-22',
    description: 'Post publish data',
  })
  @Expose()
  publishedAt!: string;
}

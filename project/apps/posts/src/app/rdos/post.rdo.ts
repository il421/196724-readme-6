import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PostState, PostType } from '@project/core';

export class PostRdo {
  @ApiProperty({
    description: 'Unique identifier',
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
  })
  @Expose()
  id!: string;

  @ApiProperty({ example: 'My new post', description: 'Post title' })
  @Expose()
  title!: string;

  @ApiProperty({
    enum: PostType,
    enumName: 'PostTypes',
    example: 'video',
    description: 'Post type',
  })
  @Expose()
  type!: PostType;

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
    example: 'c3c05894-c1a9-422d-8752-4dc83b27b7b3',
    description: 'Post author identifier',
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
    description: 'Post publisher identifier',
  })
  @Expose()
  publishedBy!: string;

  @ApiProperty({
    example: '2012-12-22',
    description: 'Post publish data',
  })
  @Expose()
  publishedAt!: string;

  @ApiProperty({
    example: 'New post',
    description: 'Text or quote post text',
  })
  @Expose()
  @Transform(({ value, obj }) =>
    obj.type === PostType.Text || obj.type === PostType.Quote
      ? value
      : undefined
  )
  text!: string;

  @ApiProperty({
    example: 'Ilya Suglobov',
    description: 'Quote post author',
  })
  @Expose()
  @Transform(({ value, obj }) =>
    obj.type === PostType.Quote ? value : undefined
  )
  quoteAuthor!: string;

  @ApiProperty({
    example: 'https://docs.nestjs.com/openapi/introduction',
    description: 'Video, photo or ref post content url',
  })
  @Expose()
  @Transform(({ value, obj }) =>
    obj.type === PostType.Video ||
    obj.type === PostType.Photo ||
    obj.type === PostType.Ref
      ? value
      : undefined
  )
  url!: string;

  @ApiProperty({
    example: 'Interesting post',
    description: 'Ref post description',
  })
  @Expose()
  @Transform(({ value, obj }) =>
    obj.type === PostType.Ref ? value : undefined
  )
  description!: string;

  @ApiProperty({
    example: 'New announcement',
    description: 'Text post announcement',
  })
  @Expose()
  @Transform(({ value, obj }) =>
    obj.type === PostType.Text ? value : undefined
  )
  announcement!: string;

  @ApiProperty({
    example: 'Number of comments',
    description: '1',
  })
  @Expose()
  commentsCount!: number;

  @ApiProperty({
    example: 'Number of likes',
    description: '1',
  })
  @Expose()
  likesCount!: number;
}

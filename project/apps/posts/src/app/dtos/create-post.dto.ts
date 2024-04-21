import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '@project/core';
import { Expose, Transform } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({ example: 'My new post', description: 'Post title' })
  @Expose()
  @Transform(({ value, obj }) =>
    obj.type === PostType.Text || obj.type === PostType.Video ? value : null
  )
  public title!: string;

  @ApiProperty({
    enum: PostType,
    enumName: 'PostType',
    example: 'video',
    description: 'Post type',
  })
  @Expose()
  public type!: PostType;

  @ApiProperty({ example: '[personal, business]', description: 'Post tags' })
  @Expose()
  tags?: string[];

  @ApiProperty({
    example: 'My perfect post text',
    description: 'Post text (for Text or Quote type only)',
  })
  @Expose()
  @Transform(({ value, obj }) =>
    obj.type === PostType.Text || obj.type === PostType.Quote ? value : null
  )
  public text!: string;

  @ApiProperty({
    example: 'https://docs.nestjs.com/openapi/introduction',
    description: 'Post link url (for Text, Photo or Ref types only)',
  })
  @Expose()
  @Transform(({ value, obj }) =>
    obj.type === PostType.Video ||
    obj.type === PostType.Photo ||
    obj.type === PostType.Ref
      ? value
      : null
  )
  public url!: string;

  @ApiProperty({
    example: 'My perfect reference post description',
    description: 'Post description (for Ref type only)',
  })
  @Expose()
  @Transform(({ value, obj }) => (obj.type === PostType.Ref ? value : null))
  public description!: string;

  @ApiProperty({
    example: 'My perfect post announcement',
    description: 'Post announcement (for Text type only)',
  })
  @Expose()
  @Transform(({ value, obj }) => (obj.type === PostType.Text ? value : null))
  public announcement!: string;

  @ApiProperty({
    example: 'Ilya Suglobov',
    description: 'Post quote author (for Quote type only)',
  })
  @Expose()
  @Expose()
  @Transform(({ value, obj }) => (obj.type === PostType.Quote ? value : null))
  public quoteAuthor!: string;

  @Expose()
  createdBy!: string;
}

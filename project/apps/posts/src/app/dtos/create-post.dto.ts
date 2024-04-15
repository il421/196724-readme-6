import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '@project/core';

export class CreatePostDto {
  @ApiProperty({ example: 'My new post', description: 'Post title' })
  public title!: string;

  @ApiProperty({
    enum: PostType,
    enumName: 'PostTypes',
    example: 'video',
    description: 'Post type',
  })
  public type!: PostType;

  @ApiProperty({ example: '[personal, business]', description: 'Post tags' })
  tags?: string[];

  @ApiProperty({
    example: 'My perfect post text',
    description: 'Post text (for Text or Quote type only)',
  })
  public text!: string;

  @ApiProperty({
    example: 'https://docs.nestjs.com/openapi/introduction',
    description: 'Post link url (for Text, Photo or Ref types only)',
  })
  public url!: string;

  @ApiProperty({
    example: 'My perfect reference post description',
    description: 'Post description (for Ref type only)',
  })
  public description!: string;

  @ApiProperty({
    example: 'My perfect post announcement',
    description: 'Post announcement (for Text type only)',
  })
  public announcement!: string;

  @ApiProperty({
    example: 'Ilya Suglobov',
    description: 'Post quote author (for Quote type only)',
  })
  public quoteAuthor!: string;
}

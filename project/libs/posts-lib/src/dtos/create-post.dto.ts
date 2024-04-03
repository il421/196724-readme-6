import { ApiProperty } from '@nestjs/swagger';
import { PostState, PostTypes, Tag } from '@project/core';

export class CreatePostDto {
  @ApiProperty()
  public title!: string;

  @ApiProperty({ enum: PostTypes })
  public type!: PostTypes;

  @ApiProperty({ enum: PostState })
  public state!: PostState;

  @ApiProperty()
  isRepost?: boolean;

  @ApiProperty()
  tags?: Tag[];

  @ApiProperty()
  public text!: string;

  @ApiProperty()
  public url!: string;

  @ApiProperty()
  public description!: string;

  @ApiProperty()
  public announcement!: string;

  @ApiProperty()
  public quoteAuthor!: string;
}

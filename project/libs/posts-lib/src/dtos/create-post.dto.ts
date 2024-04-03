import { ApiProperty } from '@nestjs/swagger';
import { PostState, PostTypes, Tag } from '@project/core';

export class CreatePostDto {
  @ApiProperty()
  public name!: string;

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

  @ApiProperty()
  public type!: PostTypes;

  @ApiProperty()
  public state!: PostState;

  @ApiProperty()
  isRepost?: boolean;

  @ApiProperty()
  tags?: Tag[];
}

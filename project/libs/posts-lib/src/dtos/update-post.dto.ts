import { ApiProperty } from '@nestjs/swagger';
import { PostState, PostTypes, Tag } from '@project/core';

export class UpdatePostDto {
  @ApiProperty()
  public title!: string;

  @ApiProperty()
  public state!: PostState;

  @ApiProperty()
  public type!: PostTypes;

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

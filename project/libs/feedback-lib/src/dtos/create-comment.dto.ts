import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty()
  public text!: string;

  @ApiProperty()
  public postId!: string;
}

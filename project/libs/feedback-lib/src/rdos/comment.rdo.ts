import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CommentRdo {
  @ApiProperty()
  @Expose()
  readonly id!: string;

  @ApiProperty()
  @Expose()
  readonly postId!: string;

  @ApiProperty()
  @Expose()
  readonly text!: string;

  @ApiProperty()
  @Expose()
  readonly createdBy!: string;

  @ApiProperty()
  @Expose()
  readonly createdAt!: string;
}

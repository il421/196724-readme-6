import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PostState, PostTypes, Tag } from '@project/core';

export class BasePostRdo {
  @ApiProperty()
  @Expose()
  readonly id!: string;

  @ApiProperty()
  @Expose()
  readonly title!: string;

  @ApiProperty({ enum: PostTypes })
  @Expose()
  readonly type!: PostTypes;

  @ApiProperty({ enum: PostState })
  @Expose()
  readonly state!: PostState;

  @ApiProperty()
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
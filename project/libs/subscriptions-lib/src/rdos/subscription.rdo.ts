import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SubscriptionRdo {
  @ApiProperty()
  @Expose()
  readonly id!: string;

  @ApiProperty()
  @Expose()
  readonly publisherId!: string;

  @ApiProperty()
  @Expose()
  readonly createdBy!: string;

  @ApiProperty()
  @Expose()
  readonly createdAt!: string;
}

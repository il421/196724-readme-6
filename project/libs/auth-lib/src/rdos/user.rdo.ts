import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserRdo {
  @ApiProperty()
  @Expose()
  readonly id!: string;

  @ApiProperty()
  @Expose()
  readonly email!: string;

  @ApiProperty()
  @Expose()
  readonly firstName!: string;

  @ApiProperty()
  @Expose()
  readonly lastName!: string;
}

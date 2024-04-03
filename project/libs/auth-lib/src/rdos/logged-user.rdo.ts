import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// @TODO need to add more fields
export class LoggedUserRdo {
  @ApiProperty()
  @Expose()
  readonly id!: string;

  @ApiProperty()
  @Expose()
  readonly email!: string;

  @ApiProperty()
  @Expose()
  readonly accessToken!: string;
}

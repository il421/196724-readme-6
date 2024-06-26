import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoggedUserRdo {
  @ApiProperty({ example: '12345qwer', description: 'API access token' })
  @Expose()
  readonly accessToken!: string;

  @ApiProperty({ example: '12345qwer', description: 'API refresh token' })
  @Expose()
  readonly refreshToken!: string;
}

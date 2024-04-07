import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@project/auth-ib';
import { UserModule } from '@project/users-lib';

@Module({
  imports: [AuthenticationModule, UserModule],
})
export class AppModule {}

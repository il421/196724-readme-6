import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@project/authentication';
import { UserModule } from '@project/user';

@Module({
  imports: [AuthenticationModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

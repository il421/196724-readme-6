import { Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserModule } from '@project/user';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  imports: [UserModule],
})
export class AuthenticationModule {}

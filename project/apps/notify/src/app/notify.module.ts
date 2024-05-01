import { Module } from '@nestjs/common';

import { NotifyController } from './notify.controller';
import { NotifyConfigModule } from './config';
import { NotificationModule } from '@project/notification-lib';
import {
  EmailSenderConfigModule,
  EmailSenderModule,
} from '@project/email-sender-lib';

@Module({
  imports: [
    NotifyConfigModule,
    EmailSenderConfigModule,
    NotificationModule,
    EmailSenderModule,
  ],
  controllers: [NotifyController],
  providers: [],
})
export class NotifyModule {}

import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { EmailSenderService } from './email-sender.service';
import { getMailerAsyncOptions } from '@project/core';

@Module({
  imports: [MailerModule.forRootAsync(getMailerAsyncOptions())],
  providers: [EmailSenderService],
  exports: [EmailSenderService],
})
export class EmailSenderModule {}

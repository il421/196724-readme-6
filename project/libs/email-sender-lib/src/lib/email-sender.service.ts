import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';

import {
  DEFAULT_DATE_FORMAT,
  EMAIL_LATEST_POSTS_SUBJECTS,
  EMAIL_POST_TEMPLATE_PATH,
} from './email-sender.constants';
import { CreatePostsEmailDto } from '@project/notification-lib';
import { mailConfig } from '@project/core';
import { ConfigType } from '@nestjs/config';
import { mapPostsForEmail } from './utils';
import dayjs from 'dayjs';

@Injectable()
export class EmailSenderService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(mailConfig.KEY)
    private readonly mailOptions: ConfigType<typeof mailConfig>
  ) {}

  public async sendNewPostsEmail(subscriber: CreatePostsEmailDto) {
    await this.mailerService.sendMail({
      from: this.mailOptions.from,
      to: subscriber.email,
      subject: EMAIL_LATEST_POSTS_SUBJECTS,
      template: EMAIL_POST_TEMPLATE_PATH,
      context: {
        latestPostsEmailDate: dayjs(subscriber?.latestPostsEmailDate).format(
          DEFAULT_DATE_FORMAT
        ),
        user: subscriber.name,
        email: subscriber.email,
        posts: mapPostsForEmail(subscriber.posts),
      },
    });
  }
}

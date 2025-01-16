import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NotifyConfig } from '@project/notify-config';
import { Post, Subscriber } from '@project/shared/core';
import {
  EMAIL_ADD_SUBSCRIBER_SUBJECT,
  EMAIL_NEW_POSTS_SUBJECT,
} from './mail.constant';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  @Inject(NotifyConfig.KEY)
  private readonly notifyConfig: ConfigType<typeof NotifyConfig>;

  public async sendNotifyNewSubscriber(subscriber: Subscriber) {
    await this.mailerService.sendMail({
      from: this.notifyConfig.mail.from,
      to: subscriber.email,
      subject: EMAIL_ADD_SUBSCRIBER_SUBJECT,
      template: './add-subscriber',
      context: {
        user: subscriber.name,
        email: subscriber.email,
      },
    });
  }

  public async sendPostsToSubscriber(posts: Post[], subscriber: Subscriber) {
    await this.mailerService.sendMail({
      from: this.notifyConfig.mail.from,
      to: subscriber.email,
      subject: EMAIL_NEW_POSTS_SUBJECT,
      template: './send-posts',
      context: {
        subscriber,
        posts,
      },
    });
  }
}

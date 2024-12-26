import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { getMailerAsyncOptions } from '@project/helpers';
import { MailService } from './mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync(getMailerAsyncOptions('application.mail')),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

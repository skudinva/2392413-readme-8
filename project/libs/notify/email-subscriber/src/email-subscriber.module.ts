import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailSubscriberFactory } from './email-subscriber.factory';
import {
  EmailSubscriberModel,
  EmailSubscriberSchema,
} from './email-subscriber.model';
import { EmailSubscriberRepository } from './email-subscriber.repository';
import { EmailSubscriberService } from './email-subscriber.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailSubscriberModel.name, schema: EmailSubscriberSchema },
    ]),
  ],
  providers: [
    EmailSubscriberService,
    EmailSubscriberRepository,
    EmailSubscriberFactory,
  ],
})
export class EmailSubscriberModule {}

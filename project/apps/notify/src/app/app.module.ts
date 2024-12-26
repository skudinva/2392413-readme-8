import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailSubscriberModule } from '@project/email-subscriber';
import { NotifyConfigModule, getMongooseOptions } from '@project/notify-config';

@Module({
  imports: [
    MongooseModule.forRootAsync(getMongooseOptions()),
    NotifyConfigModule,
    EmailSubscriberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

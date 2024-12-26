import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotifyModule } from '@project/account-notify';
import { AuthenticationModule } from '@project/authentication';
import { BlogUserModule } from '@project/blog-user';
import { AccountConfigModule, getMongooseOptions } from '@project/config';

@Module({
  imports: [
    BlogUserModule,
    AuthenticationModule,
    AccountConfigModule,
    MongooseModule.forRootAsync(getMongooseOptions()),
    NotifyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

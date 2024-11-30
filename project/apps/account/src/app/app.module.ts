import { Module } from '@nestjs/common';
import { AuthenticationModule } from '@project/authentication';
import { BlogUserModule } from '@project/blog-user';
import { AccountConfigModule } from '@project/config';

@Module({
  imports: [BlogUserModule, AuthenticationModule, AccountConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

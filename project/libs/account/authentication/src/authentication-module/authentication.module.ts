import { Module } from '@nestjs/common';
import { BlogUserModule } from '@project/blog-user';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  imports: [BlogUserModule],
})
export class AuthenticationModule {}

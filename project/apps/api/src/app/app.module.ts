import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HTTP_CLIENT_MAX_REDIRECTS, HTTP_CLIENT_TIMEOUT } from './app.config';
import { AppService } from './app.service';
import { BlogController } from './blog.controller';
import { CheckAuthForceGuard } from './guards/check-auth-force.guard';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { UsersController } from './users.controller';

@Module({
  imports: [
    HttpModule.register({
      timeout: HTTP_CLIENT_TIMEOUT,
      maxRedirects: HTTP_CLIENT_MAX_REDIRECTS,
    }),
  ],
  controllers: [UsersController, BlogController],
  providers: [CheckAuthGuard, CheckAuthForceGuard, AppService],
})
export class AppModule {}

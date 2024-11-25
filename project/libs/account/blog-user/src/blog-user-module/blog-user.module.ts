import { Module } from '@nestjs/common';
import { BlogUserController } from './blog-user.controller';
import { BlogUserService } from './blog-user.service';

@Module({
  controllers: [BlogUserController],
  providers: [BlogUserService],
})
export class BlogUserModule {}

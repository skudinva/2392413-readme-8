import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogUserController } from './blog-user.controller';
import { BlogUserFactory } from './blog-user.factory';
import { BlogUserModel, BlogUserSchema } from './blog-user.model';
import { BlogUserRepository } from './blog-user.repository';
import { BlogUserService } from './blog-user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogUserModel.name, schema: BlogUserSchema },
    ]),
  ],
  controllers: [BlogUserController],
  providers: [BlogUserRepository, BlogUserFactory, BlogUserService],
  exports: [BlogUserRepository, BlogUserService],
})
export class BlogUserModule {}

import { Module } from '@nestjs/common';
import { BlogLikeRepository } from './blog-like.repository';
import { BlogLikeService } from './blog-like.service';

@Module({
  providers: [BlogLikeService],
  exports: [BlogLikeRepository],
})
export class BlogLikeModule {}

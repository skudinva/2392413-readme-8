import { Module } from '@nestjs/common';
import { BlogLikeFactory } from './blog-like.factory';
import { BlogLikeRepository } from './blog-like.repository';
import { BlogLikeService } from './blog-like.service';

@Module({
  providers: [BlogLikeService, BlogLikeFactory, BlogLikeRepository],
  exports: [BlogLikeService],
})
export class BlogLikeModule {}

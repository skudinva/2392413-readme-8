import { Module } from '@nestjs/common';
import { BlogLikeModule } from '@project/blog-like';
import { BlogTagModule } from '@project/blog-tag';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostRepository } from './blog-post.repository';
import { BlogPostService } from './blog-post.service';

@Module({
  imports: [BlogTagModule, BlogLikeModule],
  providers: [BlogPostService, BlogPostRepository, BlogPostFactory],
  exports: [BlogPostService],
})
export class BlogPostModule {}

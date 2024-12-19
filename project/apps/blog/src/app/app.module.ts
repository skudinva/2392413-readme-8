import { Module } from '@nestjs/common';
import { BlogCommentModule } from '@project/blog-comment';
import { BlogPostModule } from '@project/blog-post';
import { BlogTagModule } from '@project/blog-tag';

@Module({
  imports: [BlogPostModule, BlogTagModule, BlogCommentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

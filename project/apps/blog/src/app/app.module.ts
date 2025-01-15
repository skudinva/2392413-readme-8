import { Module } from '@nestjs/common';
import { BlogCommentModule } from '@project/blog-comment';
import { BlogConfigModule } from '@project/blog-config';
import { BlogLikeModule } from '@project/blog-like';
import { BlogPostModule } from '@project/blog-post';
import { BlogTagModule } from '@project/blog-tag';

@Module({
  imports: [
    BlogPostModule,
    BlogTagModule,
    BlogCommentModule,
    BlogLikeModule,
    BlogConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

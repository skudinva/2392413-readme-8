import { Module } from '@nestjs/common';
import { BlogPostModule } from '@project/blog-post';
import { BlogTagModule } from '@project/blog-tag';

@Module({
  imports: [BlogTagModule, BlogPostModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

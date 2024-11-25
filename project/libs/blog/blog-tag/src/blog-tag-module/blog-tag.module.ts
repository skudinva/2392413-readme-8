import { Module } from '@nestjs/common';
import { BlogTagFactory } from './blog-tag.factory';
import { BlogTagRepository } from './blog-tag.repository';

@Module({
  providers: [BlogTagRepository, BlogTagFactory],
  exports: [BlogTagRepository],
})
export class BlogTagModule {}

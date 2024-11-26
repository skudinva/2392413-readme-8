import { Injectable } from '@nestjs/common';
import { EntityFactory, Post } from '@project/shared/core';
import { BlogPostEntity } from './blog-post.entity';

@Injectable()
export class BlogPostFactory implements EntityFactory<BlogPostEntity> {
  create(entityPlainData: Post): BlogPostEntity {
    return new BlogPostEntity(entityPlainData);
  }
}

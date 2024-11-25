import { Injectable } from '@nestjs/common';
import { EntityFactory, Post, PostType } from '@project/shared/core';
import { BlogPostEntity } from './blog-post.entity';

@Injectable()
export class BlogPostFactory<T extends PostType>
  implements EntityFactory<BlogPostEntity<T>>
{
  create(entityPlainData: Post<T>): BlogPostEntity<T> {
    return new BlogPostEntity(entityPlainData);
  }
}

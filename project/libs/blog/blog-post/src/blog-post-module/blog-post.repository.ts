import { Injectable } from '@nestjs/common';
import { BaseMemoryRepository } from '@project/data-access';
import { PostType } from '@project/shared/core';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';

@Injectable()
export class BlogPostRepository<
  T extends PostType
> extends BaseMemoryRepository<BlogPostEntity<T>> {
  constructor(entityFactory: BlogPostFactory<T>) {
    super(entityFactory);
  }

  public async findByTag(tag: string): Promise<BlogPostEntity<T> | null> {
    const entities = Array.from(this.entities.values());
    const post = entities.find(
      (entity) =>
        entity.tags !== undefined &&
        entity.tags.some((tags) => tags.title === tag)
    );

    if (!post) {
      return null;
    }

    return this.entityFactory.create(post);
  }
}

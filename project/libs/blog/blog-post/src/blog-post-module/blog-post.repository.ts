import { Injectable } from '@nestjs/common';
import { BaseMemoryRepository } from '@project/data-access';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';

@Injectable()
export class BlogPostRepository extends BaseMemoryRepository<BlogPostEntity> {
  constructor(entityFactory: BlogPostFactory) {
    super(entityFactory);
  }

  public async findByTag(tag: string): Promise<BlogPostEntity | null> {
    const post = [...this.entities.values()].find((entity) =>
      entity.tags?.some((someTag) => someTag.title === tag)
    );

    return post ? this.entityFactory.create(post) : null;
  }
}

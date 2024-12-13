import { Injectable } from '@nestjs/common';
import { BaseMemoryRepository } from '@project/data-access';
import { BlogLikeEntity } from './blog-like.entity';
import { BlogLikeFactory } from './blog-like.factory';

@Injectable()
export class BlogLikeRepository extends BaseMemoryRepository<BlogLikeEntity> {
  constructor(entityFactory: BlogLikeFactory) {
    super(entityFactory);
  }

  public async findByPostId(
    userId: string,
    postId: string
  ): Promise<BlogLikeEntity | null> {
    const like = [...this.entities.values()].find(
      (entity) => entity.postId === postId && entity.userId === userId
    );

    return like ? this.entityFactory.create(like) : null;
  }
}

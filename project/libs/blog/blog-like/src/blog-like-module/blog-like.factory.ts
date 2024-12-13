import { Injectable } from '@nestjs/common';
import { EntityFactory, Like } from '@project/shared/core';
import { BlogLikeEntity } from './blog-like.entity';

@Injectable()
export class BlogLikeFactory implements EntityFactory<BlogLikeEntity> {
  create(entityPlainData: Like): BlogLikeEntity {
    return new BlogLikeEntity(entityPlainData);
  }
}

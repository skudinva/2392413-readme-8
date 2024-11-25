import { Injectable } from '@nestjs/common';
import { EntityFactory, Tag } from '@project/shared/core';
import { BlogTagEntity } from './blog-tag.entity';

@Injectable()
export class BlogTagFactory implements EntityFactory<BlogTagEntity> {
  create(entityPlainData: Tag): BlogTagEntity {
    return new BlogTagEntity(entityPlainData);
  }
}

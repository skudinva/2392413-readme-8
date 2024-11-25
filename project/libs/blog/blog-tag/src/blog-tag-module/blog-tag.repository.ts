import { Injectable } from '@nestjs/common';
import { BaseMemoryRepository } from '@project/data-access';
import { BlogTagEntity } from './blog-tag.entity';
import { BlogTagFactory } from './blog-tag.factory';

@Injectable()
export class BlogTagRepository extends BaseMemoryRepository<BlogTagEntity> {
  constructor(entityFactory: BlogTagFactory) {
    super(entityFactory);
  }

  public async findByTitle(title: string): Promise<BlogTagEntity | null> {
    const entities = Array.from(this.entities.values());
    const tag = entities.find((entity) => entity.title === title);

    if (!tag) {
      return null;
    }

    return this.entityFactory.create(tag);
  }
}

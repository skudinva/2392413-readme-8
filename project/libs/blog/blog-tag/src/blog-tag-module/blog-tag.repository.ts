import { Injectable } from '@nestjs/common';
import { PrismaClientService } from '@project/blog-models';
import { BasePostgresRepository } from '@project/data-access';
import { Tag } from '@project/shared/core';
import { BlogTagEntity } from './blog-tag.entity';
import { BlogTagFactory } from './blog-tag.factory';

@Injectable()
export class BlogTagRepository extends BasePostgresRepository<
  BlogTagEntity,
  Tag
> {
  constructor(tagFactory: BlogTagFactory, client: PrismaClientService) {
    super(tagFactory, client);
  }

  public override async save(entity: BlogTagEntity): Promise<void> {
    const record = await this.client.tag.create({
      data: {
        ...entity.toPOJO(),
      },
    });

    entity.id = record.id;
  }

  public async findByTitle(title: string): Promise<BlogTagEntity | null> {
    const tag = await this.client.tag.findUnique({
      where: {
        title,
      },
    });

    if (!tag) {
      return null;
    }

    return this.createEntityFromDocument(tag);
  }

  public async findOrCreateByTitle(
    title: string
  ): Promise<BlogTagEntity | null> {
    const tag = this.findByTitle(title);
    if (!tag) {
      const newTag = new BlogTagEntity({ title });
      this.save(newTag);
      return newTag;
    }
    return tag;
  }
}

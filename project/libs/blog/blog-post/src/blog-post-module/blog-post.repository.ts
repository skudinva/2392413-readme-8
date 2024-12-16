import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientService } from '@project/blog-models';
import { BasePostgresRepository } from '@project/data-access';
import { Post } from '@project/shared/core';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';

@Injectable()
export class BlogPostRepository extends BasePostgresRepository<
  BlogPostEntity,
  Post
> {
  constructor(entityFactory: BlogPostFactory, client: PrismaClientService) {
    super(entityFactory, client);
  }

  public override async save(post: BlogPostEntity): Promise<void> {
    const pojoPost = post.toPOJO();
    const record = await this.client.post.create({
      data: {
        ...pojoPost,
        tags: {
          connect: pojoPost.tags?.map(({ id }) => ({ id })),
        },
        comments: undefined,
        extraProperty: pojoPost.extraProperty
          ? { create: { ...pojoPost.extraProperty } }
          : undefined,
      },
    });

    post.id = record.id;
  }

  public override async findById(
    id: BlogPostEntity['id']
  ): Promise<BlogPostEntity | null> {
    const post = await this.client.post.findUnique({
      where: { id },
      include: {
        comments: true,
        extraProperty: true,
        tags: true,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${id} not found`);
    }

    return this.createEntityFromDocument(post);
  }
}

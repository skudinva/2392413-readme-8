import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientService } from '@project/blog-models';
import { BasePostgresRepository } from '@project/data-access';
import { PaginationResult, Post } from '@project/shared/core';
import { BlogPostEntity } from './blog-post.entity';
import { BlogPostFactory } from './blog-post.factory';
import { BlogPostQuery } from './blog-post.query';

@Injectable()
export class BlogPostRepository extends BasePostgresRepository<
  BlogPostEntity,
  Post
> {
  constructor(entityFactory: BlogPostFactory, client: PrismaClientService) {
    super(entityFactory, client);
  }

  private async getPostCount(where: Prisma.PostWhereInput): Promise<number> {
    return this.client.post.count({ where });
  }

  private calculatePostsPage(totalCount: number, limit: number): number {
    if (limit === 0) {
      return 0;
    }
    return Math.ceil(totalCount / limit);
  }

  public override async save(post: BlogPostEntity): Promise<void> {
    const pojoPost = post.toPOJO();
    const record = await this.client.post.create({
      data: {
        ...pojoPost,
        tags: {
          connect: pojoPost.tags.map(({ id }) => ({ id })),
        },
        comments: {
          connect: [],
        },
        extraProperty: { create: { ...pojoPost.extraProperty } },
      },
    });

    post.id = record.id;
  }

  override async update(post: BlogPostEntity): Promise<void> {
    const pojoPost = post.toPOJO();
    await this.client.post.update({
      where: { id: post.id },
      data: {
        postType: pojoPost.postType,
        isRepost: pojoPost.isRepost,
        originAuthorId: pojoPost.originAuthorId ?? '',
        originPostId: pojoPost.originPostId ?? '',
        state: pojoPost.state,
        publicDate: pojoPost.publicDate,
        likesCount: pojoPost.likesCount,
        tags: {
          set: pojoPost.tags.map(({ id }) => ({ id })),
        },
        extraProperty: {
          update: {
            data: { ...pojoPost.extraProperty },
            where: {
              postId: post.id,
            },
          },
        },
      },
      include: {
        comments: true,
        extraProperty: true,
        tags: true,
      },
    });
  }

  public override async deleteById(id: string): Promise<void> {
    await this.client.post.delete({
      where: {
        id,
      },
    });
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

  public async find(
    query?: BlogPostQuery
  ): Promise<PaginationResult<BlogPostEntity | null>> {
    const skip =
      query?.page && query?.limit ? (query.page - 1) * query.limit : undefined;
    const take = query?.limit;
    const where: Prisma.PostWhereInput = {};
    const orderBy: Prisma.PostOrderByWithRelationInput = {};

    if (query?.tags) {
      where.tags = {
        some: {
          id: {
            in: query.tags,
          },
        },
      };
    }

    if (query?.sortDirection) {
      orderBy.createdAt = query.sortDirection;
    }

    const [records, postCount] = await Promise.all([
      this.client.post.findMany({
        where,
        orderBy,
        skip,
        take,
        include: {
          comments: true,
          extraProperty: true,
          tags: true,
        },
      }),
      this.getPostCount(where),
    ]);

    if (!records) {
      throw new Error('No records');
    }

    return {
      entities: records.map((record) => this.createEntityFromDocument(record)),
      currentPage: query?.page,
      totalPages: this.calculatePostsPage(postCount, take ?? 0),
      itemsPerPage: take ?? 0,
      totalItems: postCount,
    };
  }
}

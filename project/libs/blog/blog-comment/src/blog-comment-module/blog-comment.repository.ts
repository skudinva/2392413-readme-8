import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaClientService } from '@project/blog-models';
import { BasePostgresRepository } from '@project/data-access';
import { Comment, PaginationResult } from '@project/shared/core';
import { BlogCommentEntity } from './blog-comment.entity';
import { BlogCommentFactory } from './blog-comment.factory';
import { BlogCommentQuery } from './blog-comment.query';

@Injectable()
export class BlogCommentRepository extends BasePostgresRepository<
  BlogCommentEntity,
  Comment
> {
  constructor(
    entityFactory: BlogCommentFactory,
    override readonly client: PrismaClientService
  ) {
    super(entityFactory, client);
  }

  private async getCommentsCount(
    where: Prisma.CommentWhereInput
  ): Promise<number> {
    return this.client.comment.count({ where });
  }

  private calculateCommentPage(totalCount: number, limit: number): number {
    return Math.ceil(totalCount / limit);
  }

  public override async save(entity: BlogCommentEntity): Promise<void> {
    const record = await this.client.comment.create({
      data: { ...entity.toPOJO() },
    });

    entity.id = record.id;
  }

  public override async findById(
    id: string
  ): Promise<BlogCommentEntity | null> {
    const document = await this.client.comment.findFirst({
      where: {
        id,
      },
    });

    if (!document) {
      throw new NotFoundException(`Comment with id ${id} not found.`);
    }

    return this.createEntityFromDocument(document);
  }

  public override async deleteById(id: string): Promise<void> {
    await this.client.comment.delete({
      where: {
        id,
      },
    });
  }

  public async findByPostId(
    postId: string,
    query: BlogCommentQuery
  ): Promise<PaginationResult<BlogCommentEntity>> {
    const skip =
      query?.page && query?.limit ? (query.page - 1) * query.limit : undefined;
    const take = query?.limit;
    const where: Prisma.CommentWhereInput = { postId };
    const orderBy: Prisma.CommentOrderByWithRelationInput = {};

    if (query?.sortDirection) {
      orderBy.createdAt = query.sortDirection;
    }

    const [records, commentsCount] = await Promise.all([
      this.client.comment.findMany({ where, skip, take, orderBy }),
      this.getCommentsCount(where),
    ]);

    return {
      entities: records.map((record) => this.createEntityFromDocument(record)),
      currentPage: query?.page,
      totalPages: this.calculateCommentPage(commentsCount, take),
      itemsPerPage: take,
      totalItems: commentsCount,
    };
  }

  public async findByUserAndPostId(
    postId: string,
    userId: string
  ): Promise<BlogCommentEntity> {
    const document = await this.client.comment.findFirst({
      where: { postId, userId },
    });

    if (document) {
      return this.createEntityFromDocument(document);
    }

    return null;
  }
}

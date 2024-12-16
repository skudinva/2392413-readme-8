import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientService } from '@project/blog-models';
import { BasePostgresRepository } from '@project/data-access';
import { Comment } from '@project/shared/core';
import { BlogCommentEntity } from './blog-comment.entity';
import { BlogCommentFactory } from './blog-comment.factory';

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

  public async findByPostId(postId: string): Promise<BlogCommentEntity[]> {
    const records = await this.client.comment.findMany({
      where: {
        postId,
      },
    });

    return records.map(
      (record) => this.createEntityFromDocument(record) as BlogCommentEntity
    );
  }
}

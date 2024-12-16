import { PostState, PostType } from '@prisma/client';
import { TagRdo } from '@project/blog-tag';
import { PostExtraProperty } from '@project/shared/core';
import { Expose } from 'class-transformer';

export class BlogPostRdo {
  @Expose()
  postType!: PostType;

  @Expose()
  authorId!: string;

  @Expose()
  isRepost!: boolean;

  @Expose()
  originAuthorId?: string;

  @Expose()
  originPostId?: string;

  @Expose()
  tags!: TagRdo[];

  @Expose()
  state!: PostState;

  @Expose()
  createdAt!: Date;

  @Expose()
  publicDate!: Date;

  @Expose()
  likesCount!: number;

  @Expose()
  commentsCount!: number;

  @Expose()
  extraProperty?: PostExtraProperty;

  @Expose()
  comments!: Comment[];
}

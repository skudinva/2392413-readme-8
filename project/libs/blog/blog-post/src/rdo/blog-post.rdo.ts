import { PostState, PostType } from '@prisma/client';
import { TagRdo } from '@project/blog-tag';
import { Expose, Type } from 'class-transformer';
import { PostExtraPropertyRdo } from './post-extra-property.rdo';

export class BlogPostRdo {
  @Expose()
  public id!: string;

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
  @Type(() => TagRdo)
  tags!: TagRdo[];

  @Expose()
  state!: PostState;

  @Expose()
  createdAt!: string;

  @Expose()
  publicDate!: string;

  @Expose()
  likesCount!: number;

  @Expose()
  commentsCount!: number;

  @Expose()
  @Type(() => PostExtraPropertyRdo)
  extraProperty?: PostExtraPropertyRdo;

  @Expose()
  comments!: Comment[];
}

import { PostState, PostType } from '@prisma/client';
import { PostExtraProperty, Tag } from '@project/shared/core';

export class UpdatePostDto {
  id!: string;
  postType!: PostType;
  authorId!: string;
  isRepost!: boolean;
  originAuthorId?: string;
  originPostId?: string;
  tags?: Tag[];
  state!: PostState;
  publicDate!: Date;
  extraProperty!: PostExtraProperty;
}

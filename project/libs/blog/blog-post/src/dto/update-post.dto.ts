import { PostState, PostType, Tag } from '@project/shared/core';

export class UpdatePostDto<T extends PostType> {
  id!: string;
  postType!: T;
  authorId!: string;
  isRepost!: boolean;
  originAuthorId?: string | undefined;
  originPostId?: string | undefined;
  tags?: Tag[] | undefined;
  state!: PostState;
  publicDate!: Date;
}

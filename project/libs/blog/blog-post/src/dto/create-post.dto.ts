import { PostState, PostType, Tag } from '@project/shared/core';

export class CreatePostDto<T extends PostType> {
  postType!: T;
  authorId!: string;
  isRepost!: boolean;
  originAuthorId?: string | undefined;
  originPostId?: string | undefined;
  tags?: Tag[] | undefined;
  state!: PostState;
  publicDate!: Date;
}

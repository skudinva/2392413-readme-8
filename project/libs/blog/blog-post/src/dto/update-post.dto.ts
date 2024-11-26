import {
  PostExtraProperty,
  PostState,
  PostType,
  Tag,
} from '@project/shared/core';

export class UpdatePostDto {
  id!: string;
  postType!: PostType;
  authorId!: string;
  isRepost!: boolean;
  originAuthorId?: string | undefined;
  originPostId?: string | undefined;
  tags?: Tag[] | undefined;
  state!: PostState;
  publicDate!: Date;
  extraProperty!: PostExtraProperty[keyof PostExtraProperty];
}

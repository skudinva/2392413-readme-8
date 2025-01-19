import { PostState, PostType } from '@prisma/client';
import { PostExtraProperty } from './post-extra-property.interface';
import { Tag } from './tag.interface';

export interface Post {
  id?: string;
  postType: PostType;
  userId: string;
  isRepost: boolean;
  originUserId?: string | null;
  originPostId?: string | null;
  tags: Tag[];
  state: PostState;
  createdAt: Date;
  publicDate: Date;
  likesCount: number;
  commentsCount: number;
  extraProperty: PostExtraProperty | null;
}

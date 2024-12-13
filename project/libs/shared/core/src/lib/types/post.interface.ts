import { PostExtraProperty } from './post-extra-property.interface';
import { PostState } from './post-state.enum';
import { PostType } from './post-type.enum';
import { Tag } from './tag.interface';

export interface Post {
  id?: string;
  postType: PostType;
  authorId: string;
  isRepost: boolean;
  originAuthorId?: string;
  originPostId?: string;
  tags?: Tag[];
  state: PostState;
  createdAt: Date;
  publicDate: Date;
  likesCount: number;
  commentsCount: number;
  extraProperty: PostExtraProperty[keyof PostExtraProperty];
}

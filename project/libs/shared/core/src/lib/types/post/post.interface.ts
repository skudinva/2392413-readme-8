import { PostState } from '../post-state.enum';
import { PostType } from '../post-type.enum';
import { Tag } from '../tag.interface';

export interface Post<T extends PostType> {
  id?: string;
  postType: T;
  authorId: string;
  isRepost: boolean;
  originAuthorId?: string;
  originPostId?: string;
  tags?: Tag[];
  state: PostState;
  createDate: Date;
  publicDate: Date;
  likesCount: number;
  commentsCount: number;
}

import { PostState } from './post-state.enum';
import { PostType } from './post-type.enum';

export interface Post<T extends PostType> {
  id?: string;
  postType: T;
  authorId: string;
  isRepost: boolean;
  originAuthorId: string;
  originPostId: string;
  tags?: string[];
  state: PostState;
  createDate: Date;
  publicDate: Date;
}

export interface VideoPost extends Post<PostType.Video> {
  name: string;
  url: string;
}

export interface TextPost extends Post<PostType.Text> {
  name: string;
  announce: string;
  text: string;
}

export interface QuotePost extends Post<PostType.Quote> {
  text: string;
  authorName: string;
}

export interface PhotoPost extends Post<PostType.Photo> {
  photo: string;
}

export interface LinkPost extends Post<PostType.Link> {
  url: string;
  describe: string;
}

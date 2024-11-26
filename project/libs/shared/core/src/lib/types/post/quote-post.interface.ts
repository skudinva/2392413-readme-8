import { PostType } from '../post-type.enum';
import { Post } from './post.interface';

export interface QuotePost extends Post<PostType.Quote> {
  text: string;
  authorName: string;
}

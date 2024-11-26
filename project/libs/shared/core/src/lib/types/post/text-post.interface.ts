import { PostType } from '../post-type.enum';
import { Post } from './post.interface';

export interface TextPost extends Post<PostType.Text> {
  name: string;
  announce: string;
  text: string;
}

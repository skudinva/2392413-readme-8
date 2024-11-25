import { PostType } from './post-type.enum';
import { Post } from './post.interface';

export interface VideoPost extends Post<PostType.Video> {
  name: string;
  url: string;
}

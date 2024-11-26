import { PostType } from '../post-type.enum';
import { Post } from './post.interface';

export interface LinkPost extends Post<PostType.Link> {
  url: string;
  describe: string;
}

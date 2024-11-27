import { PostType } from './post-type.enum';

export interface PostExtraProperty {
  [PostType.Link]: { url: string; describe: string };

  [PostType.Photo]: {
    photo: string;
  };

  [PostType.Quote]: {
    text: string;
  };

  [PostType.Text]: {
    name: string;
    announce: string;
    text: string;
  };

  [PostType.Video]: {
    name: string;
    url: string;
  };
}

import {
  Entity,
  Post,
  PostExtraProperty,
  PostState,
  PostType,
  StorableEntity,
  Tag,
} from '@project/shared/core';

export class BlogPostEntity extends Entity implements StorableEntity<Post> {
  public postType!: PostType;
  public authorId!: string;
  public isRepost!: boolean;
  public originAuthorId!: string;
  public originPostId!: string;
  public tags!: Tag[];
  public state!: PostState;
  public createDate!: Date;
  public publicDate!: Date;
  public likesCount!: number;
  public commentsCount!: number;
  public extraProperty!: PostExtraProperty[keyof PostExtraProperty];

  constructor(post?: Post) {
    super();
    this.populate(post);
  }
  public populate(post?: Post): void {
    if (!post) {
      return;
    }
    const {
      id,
      postType,
      authorId,
      isRepost,
      originAuthorId,
      originPostId,
      tags,
      state,
      createDate,
      publicDate,
      likesCount,
      commentsCount,
      extraProperty,
    } = post;

    this.id = id ?? '';
    this.postType = postType;
    this.authorId = authorId;
    this.isRepost = isRepost;
    this.originAuthorId = originAuthorId ?? '';
    this.originPostId = originPostId ?? '';
    this.tags = tags ?? [];
    this.state = state;
    this.createDate = createDate;
    this.publicDate = publicDate;
    this.likesCount = likesCount;
    this.commentsCount = commentsCount;
    this.extraProperty = extraProperty;
  }

  toPOJO(): Post {
    const {
      id,
      postType,
      authorId,
      isRepost,
      originAuthorId,
      originPostId,
      tags,
      state,
      createDate,
      publicDate,
      likesCount,
      commentsCount,
      extraProperty,
    } = this;

    return {
      id,
      postType,
      authorId,
      isRepost,
      originAuthorId,
      originPostId,
      tags,
      state,
      createDate,
      publicDate,
      likesCount,
      commentsCount,
      extraProperty,
    };
  }
}

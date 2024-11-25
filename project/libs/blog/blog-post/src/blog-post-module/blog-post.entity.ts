import {
  Entity,
  Post,
  PostState,
  PostType,
  StorableEntity,
  Tag,
} from '@project/shared/core';

export class BlogPostEntity<T extends PostType>
  extends Entity
  implements StorableEntity<Post<T>>
{
  public postType!: T;
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

  constructor(post?: Post<T>) {
    super();
    this.populate(post);
  }
  public populate(post?: Post<T>): void {
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
  }

  toPOJO(): Post<T> {
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
    };
  }
}

import { Entity, Like, StorableEntity } from '@project/shared/core';

export class BlogLikeEntity extends Entity implements StorableEntity<Like> {
  public userId!: string;
  public postId!: string;

  constructor(like?: Like) {
    super();
    this.populate(like);
  }
  public populate(like?: Like): void {
    if (!like) {
      return;
    }
    const { userId, postId, id } = like;

    this.id = id ?? '';
    this.userId = userId;
    this.postId = postId;
  }

  toPOJO(): Like {
    return {
      id: this.id,
      userId: this.userId,
      postId: this.postId,
    };
  }
}

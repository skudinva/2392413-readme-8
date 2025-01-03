import { Expose } from 'class-transformer';

export class BlogCommentRdo {
  @Expose()
  public postId!: string;

  @Expose()
  public message!: string;

  @Expose()
  public userId!: string;

  @Expose()
  public createdAt!: string;
}

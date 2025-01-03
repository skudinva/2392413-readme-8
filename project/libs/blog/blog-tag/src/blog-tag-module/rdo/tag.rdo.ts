import { Expose } from 'class-transformer';

export class TagRdo {
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;
}

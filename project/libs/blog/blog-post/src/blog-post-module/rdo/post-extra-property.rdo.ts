import { Expose } from 'class-transformer';

export class PostExtraPropertyRdo {
  @Expose()
  url?: string;

  @Expose()
  describe?: string;

  @Expose()
  photo?: string;

  @Expose()
  text?: string;

  @Expose()
  announce?: string;

  @Expose()
  name?: string;
}

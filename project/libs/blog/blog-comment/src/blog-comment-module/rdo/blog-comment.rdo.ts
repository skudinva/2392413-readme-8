import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BlogCommentRdo {
  @ApiProperty({
    description: 'ID comment',
    example: '6cd1ef70-c62b-5714-8a1d-4a5548f3942d',
  })
  @Expose()
  id: string;

  @Expose()
  @ApiProperty({
    description: 'ID post',
    example: '45463002-e83e-5024-8fce-974ba5b6e5af',
  })
  public postId!: string;

  @Expose()
  @ApiProperty({
    description: 'Comment message',
    example: 'Some comment for post',
  })
  public message!: string;

  @Expose()
  @ApiProperty({
    description: 'User Id',
    example: '677cd8d75ff92067f1de5911',
  })
  public userId!: string;

  @Expose()
  @ApiProperty({
    description: 'Date of comment',
    example: '2024-02-15T13:43:22+07:00',
  })
  public createdAt!: string;
}

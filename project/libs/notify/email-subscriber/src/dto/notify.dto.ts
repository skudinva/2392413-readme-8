import { ApiProperty } from '@nestjs/swagger';
import { Post } from '@project/shared/core';
import { IsMongoId } from 'class-validator';

export class NotifyDto {
  @ApiProperty({
    description: 'userId',
    example: '677cd8d75ff92067f1de5911',
  })
  @IsMongoId()
  public userId: string;

  public posts: Post[];
}

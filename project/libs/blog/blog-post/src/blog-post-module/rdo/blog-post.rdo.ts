import { ApiProperty } from '@nestjs/swagger';
import { TagRdo } from '@project/blog-tag';
import { Expose, Type } from 'class-transformer';
import { PostExtraPropertyRdo } from './post-extra-property.rdo';

export class BlogPostRdo {
  @Expose()
  @ApiProperty({
    description: 'postId',
    example: '0a7cbc9e-9754-4187-ad0f-5b99d4b0814b',
  })
  public id!: string;

  @Expose()
  @ApiProperty({
    description: 'post type',
    example: 'Video',
  })
  postType!: string;

  @Expose()
  @ApiProperty({
    description: 'Author Id',
    example: '999aef3b7eadb76365f3c2cb',
  })
  userId!: string;

  @Expose()
  @ApiProperty({
    description: 'Repost flag',
    example: 'true',
  })
  isRepost!: boolean;

  @Expose()
  @ApiProperty({
    description: 'Source author Id',
    example: '999aef3b7eadb76365f3c2cb',
  })
  originUserId?: string;

  @Expose()
  @ApiProperty({
    description: 'Source post Id',
    example: '0a7cbc9e-9754-4187-ad0f-5b99d4b0814b',
  })
  originPostId?: string;

  @Expose()
  @Type(() => TagRdo)
  @ApiProperty({
    description: 'List of tags',
    example: [
      { title: '#sometag', id: '863f37cc-b7c6-581c-ba07-f0ec0607dc4a' },
    ],
  })
  tags!: TagRdo[];

  @Expose()
  @ApiProperty({
    description: 'Post state',
    example: 'Published',
  })
  state!: string;

  @Expose()
  @ApiProperty({
    description: 'Date of post create',
    example: '2024-11-24T10:42:10+07:00',
  })
  createdAt!: string;

  @Expose()
  @ApiProperty({
    description: 'Date of post publication',
    example: '2024-11-24T10:42:10+07:00',
  })
  publicDate!: string;

  @Expose()
  @ApiProperty({
    description: 'Likes count',
    example: 8,
  })
  likesCount!: number;

  @Expose()
  @ApiProperty({
    description: 'Comments count',
    example: 10,
  })
  commentsCount!: number;

  @Expose()
  @Type(() => PostExtraPropertyRdo)
  extraProperty?: PostExtraPropertyRdo;

  @Expose()
  comments!: Comment[];
}

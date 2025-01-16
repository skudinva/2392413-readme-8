import { ApiProperty } from '@nestjs/swagger';
import { PostType } from '@prisma/client';
import { SortDirection, SortType } from '@project/shared/core';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  DEFAULT_PAGE_COUNT,
  DEFAULT_POST_COUNT_LIMIT,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_TYPE,
} from './blog-post.constant';

export class BlogPostQuery {
  public limit: number = DEFAULT_POST_COUNT_LIMIT;

  @IsArray()
  @IsOptional()
  @ApiProperty({
    description: 'Tags',
    required: false,
  })
  public tags?: string[];

  @IsIn(Object.values(SortDirection))
  @IsOptional()
  @ApiProperty({
    description: 'sortDirection',
    enum: SortDirection,
    enumName: 'SortDirection',
  })
  public sortDirection: SortDirection = DEFAULT_SORT_DIRECTION;

  @IsIn(Object.values(SortType))
  @IsOptional()
  @ApiProperty({
    description: 'sortBy',
    enum: SortType,
    enumName: 'SortType',
  })
  public sortBy: SortType = DEFAULT_SORT_TYPE;

  @Transform(({ value }) => parseInt(value, 10) || DEFAULT_PAGE_COUNT)
  @IsOptional()
  @ApiProperty({
    description: 'page',
    example: 1,
  })
  public page: number = DEFAULT_PAGE_COUNT;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'search',
    required: false,
  })
  public search?: string;

  @IsString()
  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'Author id of the post',
    example: '677cd8d75ff92067f1de5911',
  })
  postUserId: string;

  @ApiProperty({
    description: 'Post type',
    example: 'Video',
    enum: PostType,
    enumName: 'PostType',
    required: false,
  })
  @IsIn(Object.values(PostType))
  @IsOptional()
  postType!: PostType;

  @IsString()
  @IsMongoId()
  @IsOptional()
  @ApiProperty({
    required: false,
    description: 'id of login user',
    example: '677cd8d75ff92067f1de5911',
  })
  userId?: string;
}

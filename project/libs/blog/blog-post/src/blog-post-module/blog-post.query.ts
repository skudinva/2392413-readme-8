import { ApiProperty } from '@nestjs/swagger';
import { SortDirection, SortType } from '@project/shared/core';
import { Transform } from 'class-transformer';
import { IsArray, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  DEFAULT_PAGE_COUNT,
  DEFAULT_POST_COUNT_LIMIT,
  DEFAULT_SORT_DIRECTION,
  DEFAULT_SORT_TYPE,
} from './blog-post.constant';

export class BlogPostQuery {
  @Transform(({ value }) => parseInt(value, 10) || DEFAULT_POST_COUNT_LIMIT)
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Limit post count',
    example: 10,
  })
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
}

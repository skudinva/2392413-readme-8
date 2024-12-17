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
  public limit: number = DEFAULT_POST_COUNT_LIMIT;

  @IsArray()
  @IsOptional()
  public tags?: string[];

  @IsIn(Object.values(SortDirection))
  @IsOptional()
  public sortDirection: SortDirection = DEFAULT_SORT_DIRECTION;

  @IsIn(Object.values(SortType))
  @IsOptional()
  public sortBy: SortType = DEFAULT_SORT_TYPE;

  @Transform(({ value }) => parseInt(value, 10) || DEFAULT_PAGE_COUNT)
  @IsOptional()
  public page: number = DEFAULT_PAGE_COUNT;

  @IsString()
  @IsOptional()
  public search?: string;
}

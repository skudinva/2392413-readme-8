import { SortDirection } from '@project/shared/core';
import { Transform } from 'class-transformer';
import { IsIn, IsNumber, IsOptional } from 'class-validator';

import {
  DEFAULT_PAGE_COUNT,
  DEFAULT_SORT_DIRECTION,
  MAX_COMMENTS_COUNT,
} from './blog-comment.constant';

export class BlogCommentQuery {
  @Transform(({ value }) => parseInt(value, 10) || MAX_COMMENTS_COUNT)
  @IsNumber()
  @IsOptional()
  public limit: number = MAX_COMMENTS_COUNT;

  @IsIn(Object.values(SortDirection))
  @IsOptional()
  public sortDirection: SortDirection = DEFAULT_SORT_DIRECTION;

  @Transform(({ value }) => parseInt(value, 10) || DEFAULT_PAGE_COUNT)
  @IsOptional()
  public page: number = DEFAULT_PAGE_COUNT;
}

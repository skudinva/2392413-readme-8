import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { BlogPostRdo } from './blog-post.rdo';

export class BlogPostWithPaginationRdo {
  @Expose()
  @ApiProperty({
    description: 'List of entity',
  })
  @Type(() => BlogPostRdo)
  @ValidateNested({ always: true })
  public entities!: BlogPostRdo[];

  @Expose()
  @ApiProperty({
    description: 'totalPages',
    example: 10,
  })
  public totalPages!: number;

  @Expose()
  @ApiProperty({
    description: 'totalItems',
    example: 100,
  })
  public totalItems!: number;

  @Expose()
  @ApiProperty({
    description: 'currentPage',
    example: 1,
  })
  public currentPage!: number;

  @Expose()
  @ApiProperty({
    description: 'itemsPerPage',
    example: 5,
  })
  public itemsPerPage!: number;
}

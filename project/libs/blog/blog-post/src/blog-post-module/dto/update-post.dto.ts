import { PostState, PostType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsISO8601,
  IsMongoId,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { PostExtraPropertyDto } from './post-extra-property.dto';
import { IsValidPostCombination } from './valid-post-property';

export class UpdatePostDto {
  @IsIn(Object.values(PostType))
  @IsOptional()
  postType?: PostType;

  @IsString()
  @IsMongoId()
  @IsOptional()
  authorId?: string;

  @IsBoolean()
  @IsOptional()
  isRepost?: boolean;

  @IsString()
  @IsOptional()
  @IsMongoId()
  originAuthorId?: string;

  @IsString()
  @IsOptional()
  originPostId?: string;

  @IsOptional()
  @IsString({ each: true })
  @ArrayMaxSize(8)
  @IsArray()
  @Length(3, 10, { each: true })
  tags?: string[];

  @IsIn(Object.values(PostState))
  @IsOptional()
  state?: PostState;

  @IsISO8601()
  @IsOptional()
  publicDate?: Date;

  @ValidateNested()
  @IsOptional()
  @Type(() => PostExtraPropertyDto)
  @IsValidPostCombination({
    message: 'Invalid combination of PostType',
  })
  extraProperty?: PostExtraPropertyDto;
}

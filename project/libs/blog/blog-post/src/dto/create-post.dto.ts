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

export class CreatePostDto {
  @IsIn(Object.values(PostType))
  postType!: PostType;

  @IsString()
  @IsMongoId()
  authorId!: string;

  @IsBoolean()
  isRepost!: boolean;

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
  state!: PostState;

  @IsISO8601()
  publicDate!: Date;

  @ValidateNested()
  @Type(() => PostExtraPropertyDto)
  extraProperty!: PostExtraPropertyDto;
}

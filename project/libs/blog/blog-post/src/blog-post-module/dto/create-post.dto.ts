import { ApiProperty } from '@nestjs/swagger';
import { PostState, PostType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsMongoId,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { PostExtraPropertyDto } from './post-extra-property.dto';
import { IsValidPostCombination } from './valid-post-property';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post type',
    example: 'Video',
    enum: PostType,
    enumName: 'PostType',
  })
  @IsIn(Object.values(PostType))
  postType!: PostType;

  @IsString()
  @IsMongoId()
  @ApiProperty({
    description: 'Author id of the post',
    example: '677cd8d75ff92067f1de5911',
  })
  authorId!: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({
    description: 'Repost flag',
    example: 'false',
  })
  isRepost!: boolean;

  @IsString()
  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    description: 'Source author Id',
    example: '999aef3b7eadb76365f3c2cb',
  })
  originAuthorId?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Source post Id',
    example: '0a7cbc9e-9754-4187-ad0f-5b99d4b0814b',
  })
  originPostId?: string;

  @IsOptional()
  @IsString({ each: true })
  @ArrayMaxSize(8)
  @IsArray()
  @Length(3, 10, { each: true })
  @ApiProperty({
    description: 'List of tags',
    example: ['#sometag1'],
  })
  tags?: string[];

  @IsIn(Object.values(PostState))
  @ApiProperty({
    description: 'Post state',
    example: 'Published',
    enum: PostState,
    enumName: 'PostState',
  })
  state!: PostState;

  @ValidateNested()
  @Type(() => PostExtraPropertyDto)
  @IsValidPostCombination({
    message: 'Invalid combination of PostType',
  })
  @ApiProperty()
  extraProperty!: PostExtraPropertyDto;
}

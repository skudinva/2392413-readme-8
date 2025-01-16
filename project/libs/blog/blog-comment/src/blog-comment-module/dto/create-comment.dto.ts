import { ApiProperty } from '@nestjs/swagger';
import { FieldValidate } from '@project/shared/core';
import { IsMongoId, IsNotEmpty, IsString, Length } from 'class-validator';
import { BlogCommentValidateMessage } from '../blog-comment.constant';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: BlogCommentValidateMessage.MessageIsEmpty })
  @ApiProperty({
    description: 'Comment message',
    example: 'Some comment for post',
  })
  @IsString()
  @Length(FieldValidate.MinCommentLength, FieldValidate.MaxCommentLength)
  public message!: string;

  @IsString()
  @IsMongoId({ message: BlogCommentValidateMessage.InvalidID })
  @ApiProperty({
    description: 'User Id',
    example: '677cd8d75ff92067f1de5911',
  })
  public userId!: string;
}

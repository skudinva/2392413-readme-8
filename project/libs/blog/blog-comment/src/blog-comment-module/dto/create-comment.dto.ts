import { ApiProperty } from '@nestjs/swagger';
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
  @Length(10, 300)
  public message!: string;

  @IsString()
  @IsMongoId({ message: BlogCommentValidateMessage.InvalidID })
  @ApiProperty({
    description: 'User Id',
    example: '888aef3b7eadb76365f3c2cb',
  })
  public userId!: string;
}

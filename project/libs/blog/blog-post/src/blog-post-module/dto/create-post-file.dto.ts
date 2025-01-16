import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import 'multer';
import { CreatePostDto } from './create-post.dto';

export class CreatePostFileDto {
  @ApiProperty({
    description: 'photo file',
    type: 'string',
    format: 'binary',
    required: false,
  })
  public file?: Express.Multer.File;

  @ValidateNested()
  @Type(() => CreatePostDto)
  @ApiProperty()
  post: CreatePostDto;
}

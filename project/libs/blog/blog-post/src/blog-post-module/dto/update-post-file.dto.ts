import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import 'multer';
import { UpdatePostDto } from './update-post.dto';

export class UpdatePostFileDto {
  @ApiProperty({
    description: 'photo file',
    type: 'string',
    format: 'binary',
    required: false,
  })
  public file?: Express.Multer.File;

  @ValidateNested()
  @Type(() => UpdatePostDto)
  @ApiProperty()
  post: UpdatePostDto;
}

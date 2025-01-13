import { ApiProperty } from '@nestjs/swagger';
import 'multer';
import { CreatePostDto } from './create-post.dto';

export class CreatePostFileDto extends CreatePostDto {
  @ApiProperty({
    description: 'photo file',
    type: 'string',
    format: 'binary',
    required: false,
  })
  public file?: Express.Multer.File;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: 'Tag for the post',
    example: 'sometag',
  })
  @IsString()
  @Length(3, 10)
  public title!: string;
}

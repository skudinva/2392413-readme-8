import { ApiProperty } from '@nestjs/swagger';
import { FieldValidate } from '@project/shared/core';
import { IsString, Length } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    description: 'Tag for the post',
    example: '#sometag',
  })
  @IsString()
  @Length(FieldValidate.MinTagLength, FieldValidate.MaxTagLength)
  public title!: string;
}

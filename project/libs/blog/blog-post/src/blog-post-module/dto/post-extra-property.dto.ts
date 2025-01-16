import { ApiProperty } from '@nestjs/swagger';
import { FieldValidate } from '@project/shared/core';
import {
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

export class PostExtraPropertyDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'URL',
    example: 'https://www.youtube.com/watch?v=tK2G3gwrs99',
  })
  @IsUrl()
  url?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Describe of publication',
    example: 'Example describe of publication',
  })
  @MaxLength(300)
  describe?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Photo URL',
    example: 'http://ya.ru/data/test.jpg',
  })
  photo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Text publication',
    example: 'Example text publication',
  })
  @Length(FieldValidate.MinPostTextLength, FieldValidate.MaxPostTextLength)
  text?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Announce publication',
    example: 'Example announce publication',
  })
  @Length(
    FieldValidate.MinPostAnnounceLength,
    FieldValidate.MaxPostAnnounceLength
  )
  announce?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Name of publication',
    example: 'Example name publication',
  })
  @Length(FieldValidate.MinPostNameLength, FieldValidate.MaxPostNameLength)
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Quote text publication',
    example: 'Example quote text publication',
  })
  @Length(
    FieldValidate.MinPostQuoteTextLength,
    FieldValidate.MaxPostQuoteTextLength
  )
  quoteText?: string;

  @ApiProperty({
    description: 'Author of the quote',
    example: 'Example quote author',
  })
  @IsString()
  @IsOptional()
  @Length(FieldValidate.MinUserNameLength, FieldValidate.MaxUserNameLength)
  public quoteAuthor: string;
}

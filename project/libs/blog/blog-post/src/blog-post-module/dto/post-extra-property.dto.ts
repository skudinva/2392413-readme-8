import { ApiProperty } from '@nestjs/swagger';
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
  @Length(100, 1024)
  text?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Announce publication',
    example: 'Example announce publication',
  })
  @Length(50, 255)
  announce?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Name of publication',
    example: 'Example name publication',
  })
  @Length(20, 50)
  name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'Quote text publication',
    example: 'Example quote text publication',
  })
  @Length(20, 300)
  quoteText?: string;

  @ApiProperty({
    description: 'Author of the quote',
    example: 'Example quote author',
  })
  @IsString()
  @Length(3, 50)
  public quoteAuthor: string;
}

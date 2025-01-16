import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PostExtraPropertyRdo {
  @Expose()
  @ApiProperty({
    description: 'URL',
    example: 'http://ya.ru/videodata/test.mpeg',
  })
  url?: string;

  @Expose()
  @ApiProperty({
    description: 'Describe of publication',
    example: 'Example describe of publication',
  })
  describe?: string;

  @Expose()
  @ApiProperty({
    description: 'Photo URL',
    example: 'http://ya.ru/data/test.jpg',
  })
  photo?: string;

  @Expose()
  @ApiProperty({
    description: 'Text publication',
    example: 'Example text publication',
  })
  text?: string;

  @Expose()
  @ApiProperty({
    description: 'Announce publication',
    example: 'Example announce publication',
  })
  announce?: string;

  @Expose()
  @ApiProperty({
    description: 'Name of publication',
    example: 'Example name publication',
  })
  name?: string;

  @ApiProperty({
    description: 'Quote text publication',
    example: 'Example quote text publication',
  })
  quoteText?: string;

  @ApiProperty({
    description: 'Author of the quote',
    example: 'Example quote author',
  })
  quoteAuthor?: string;
}

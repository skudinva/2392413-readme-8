import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TagRdo {
  @Expose()
  @ApiProperty({
    description: 'Tag Id',
    example: '0a7cbc9e-9754-4187-ad0f-5b99d4b0814b',
  })
  public id!: string;

  @Expose()
  @ApiProperty({
    description: 'Tag name',
    example: 'sometagname',
  })
  public title!: string;
}

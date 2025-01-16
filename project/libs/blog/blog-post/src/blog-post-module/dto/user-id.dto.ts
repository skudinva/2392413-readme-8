import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class UserIdDto {
  @ApiProperty({
    description: 'userId',
    example: '669aef3b7eadb26966f3c2cb',
  })
  @IsMongoId({ message: 'UserId should be valid MongoId' })
  userId: string;
}

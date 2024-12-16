import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

export class CreateUserDto extends LoginUserDto {
  @ApiProperty({
    description: 'User name',
    example: 'Keks',
  })
  @IsString()
  public name: string;

  @ApiProperty({
    description: 'User avatar path',
    example: '/images/user.png',
  })
  @IsString()
  public avatar: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { LoginUserDto } from './login-user.dto';

export class CreateUserDto extends LoginUserDto {
  @ApiProperty({
    description: 'User name',
    example: 'Keks',
  })
  public name: string;

  @ApiProperty({
    description: 'User avatar path',
    example: '/images/user.png',
  })
  public avatar: string;
}

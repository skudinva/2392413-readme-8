import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { AuthenticationValidateMessage } from '../authentication-module/authentication.constant';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User password',
    example: '123456',
  })
  @IsString()
  @Length(6, 12, { message: AuthenticationValidateMessage.PasswordNotValid })
  public password: string;
}

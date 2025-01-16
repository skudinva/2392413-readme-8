import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

import { FieldValidate } from '@project/shared/core';
import { AuthenticationValidateMessage } from '../authentication-module/authentication.constant';
import { LoginUserDto } from './login-user.dto';

export class CreateUserDto extends LoginUserDto {
  @ApiProperty({
    description: 'User name',
    example: 'Keks',
  })
  @IsString()
  @Length(FieldValidate.MinUserNameLength, FieldValidate.MaxUserNameLength, {
    message: AuthenticationValidateMessage.NameNotValid,
  })
  public name: string;

  @ApiProperty({
    description: 'User avatar path',
    example: '/images/user.png',
  })
  @IsString()
  public avatar: string;
}

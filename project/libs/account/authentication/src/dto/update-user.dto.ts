import { ApiProperty } from '@nestjs/swagger';
import { FieldValidate } from '@project/shared/core';
import { IsString, Length } from 'class-validator';
import { AuthenticationValidateMessage } from '../authentication-module/authentication.constant';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User password',
    example: '123456',
  })
  @IsString()
  @Length(FieldValidate.MinPasswordLength, FieldValidate.MaxPasswordLength, {
    message: AuthenticationValidateMessage.PasswordNotValid,
  })
  public password: string;
}

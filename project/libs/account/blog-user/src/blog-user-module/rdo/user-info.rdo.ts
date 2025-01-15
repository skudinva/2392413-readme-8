import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserInfoRdo {
  @ApiProperty({
    description: 'The uniq user ID',
    example: '134ce8babd-cc30-4805-9b12-d9420398e7c5',
  })
  @Expose()
  public id!: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@user.local',
  })
  @Expose()
  public email!: string;

  @ApiProperty({
    description: 'User name',
    example: 'Keks',
  })
  @Expose()
  public name!: string;
}

import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UserRdo {
  @ApiProperty({
    description: 'The uniq user ID',
    example: '134ce8babd-cc30-4805-9b12-d9420398e7c5',
  })
  @Expose()
  public id: string;

  @ApiProperty({
    description: 'User avatar path',
    example: '/images/user.png',
  })
  @Expose()
  public avatar: string;

  @ApiProperty({
    description: 'User register date (ISO format)',
    example: '1981-03-12',
  })
  @Expose()
  public registerDate: string;

  @ApiProperty({
    description: 'User email',
    example: 'user@user.local',
  })
  @Expose()
  public email: string;

  @ApiProperty({
    description: 'User name',
    example: 'Keks',
  })
  @Expose()
  public name: string;

  @ApiProperty({
    description: 'Subscribers user count',
    example: '10',
  })
  @Expose()
  public subscribersCount: number;

  @ApiProperty({
    description: 'The number of user posts',
    example: '10',
  })
  @Expose()
  public postsCount: number;

  @ApiProperty({
    description: 'Subscriptions',
  })
  @Expose()
  public subscriptions: string[];
}

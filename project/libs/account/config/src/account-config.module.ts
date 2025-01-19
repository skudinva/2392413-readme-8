import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import applicationConfig from './configurations/app.config';
import jwtConfig from './configurations/jwt.config';
import mongoConfig from './configurations/mongo.config';
import rabbitConfig from './configurations/rabbit.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [applicationConfig, mongoConfig, jwtConfig, rabbitConfig],
    }),
  ],
})
export class AccountConfigModule {}

import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { NotifyModule } from '@project/account-notify';
import { BlogUserModule } from '@project/blog-user';
import { getJwtOptions } from '@project/config';
import { RefreshTokenModule } from '../refresh-token-module/refresh-token.module';
import { JwtAccessStrategy } from '../strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from '../strategies/jwt-refresh.strategy';
import { LocalStrategy } from '../strategies/local.strategy';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
@Module({
  imports: [
    BlogUserModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: getJwtOptions,
    }),
    NotifyModule,
    RefreshTokenModule,
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    JwtAccessStrategy,
    LocalStrategy,
    JwtRefreshStrategy,
  ],
})
export class AuthenticationModule {}

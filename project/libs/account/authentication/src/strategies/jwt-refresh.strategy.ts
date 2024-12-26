import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { jwtConfig } from '@project/config';
import { TokenPayload } from '@project/shared/core';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticationService } from '../authentication-module/authentication.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtOptions: ConfigType<typeof jwtConfig>,
    private readonly authService: AuthenticationService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtOptions.refreshTokenSecret,
    });
  }

  public async validate(payload: TokenPayload) {
    return this.authService.getUserByEmail(payload.email);
  }
}

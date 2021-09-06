import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'
import { Injectable, UnauthorizedException, Body } from '@nestjs/common'
import { AuthService } from '../auth/auth.service'

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refreshtoken',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('accessToken'),
      ignoreExpiration: true,
      secretOrKey: process.env.JWT_KEY,
      passReqToCallback: true,
    })
  }

  async validate(req, payload: any) {
    const user = await this.authService.findOne(payload.userId)

    if (!user) {
      throw new UnauthorizedException()
    }
    if (req.body.refreshToken != user.refreshtoken) {
      throw new UnauthorizedException()
    }
    if (new Date() > new Date(user.refreshtokenexpires)) {
      throw new UnauthorizedException()
    }
    return { userId: payload.userId, username: payload.username }
  }
}

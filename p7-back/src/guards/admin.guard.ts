import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

const jwt = require('jsonwebtoken')

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const authorization = request.headers.authorization

    if (!authorization) {
      throw new UnauthorizedException()
    }
    const token = authorization.split(' ')[1]
    const payload = jwt.decode(token)

    if (!payload?.isAdmin) {
      throw new UnauthorizedException()
    }

    return true
  }
}

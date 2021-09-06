import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
  Request,
  Get,
  Put,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { SignupDto } from './auth.dto'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  singup(@Body() auth: SignupDto) {
    return this.authService.signup(auth)
  }

  @Post('login')
  @UseGuards(AuthGuard('local'))
  login(@Request() req) {
    return this.authService.createToken(req.user)
  }

  @Post('refreshtoken')
  @UseGuards(AuthGuard('jwt-refreshtoken'))
  async refreshToken(@Request() req) {
    return await this.authService.createToken(req.user)
  }

  @Put('updatePassword')
  @UseGuards(AuthGuard('jwt'))
  async updatePassword(@Request() req) {
    return await this.authService.updatePassword(req.body.id, req.body.password)
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.authService.delete(id)
  }

  @Get('checkMyToken')
  async checkMyToken(@Request() req) {
    return this.authService.checkMyToken(req.headers.authorization)
  }
}

import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { multerOptions } from 'src/utils/multer.config'

import { UserService } from './user.service'
import { AuthService } from '../auth/auth.service'

@Controller('users')
export class UserController {
  constructor(readonly userService: UserService) {}

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(id)
  }
}

@Controller('profile')
export class profileController {
  constructor(
    readonly userService: UserService,
    readonly authService: AuthService,
  ) {}

  @Get()
  getAll() {
    return this.userService.getAllProfile()
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOneProfile(id)
  }

  @Put('')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  async updateProfile(
    @Body() userProfile: any,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const userId = await this.authService.getMyIdFromToken(
        req.headers.authorization,
      )
      if (file) {
        userProfile.avatar = file.path
      }
      return this.userService.update(userId, userProfile)
    } catch (error) {
      throw error
    }
  }

  @Put('cover')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('imageCover', multerOptions))
  async cover(@Request() req, @UploadedFile() imageCover: Express.Multer.File) {
    try {
      const userId = await this.authService.getMyIdFromToken(
        req.headers.authorization,
      )
      return this.userService.cover(userId, imageCover.path)
    } catch {
      return { message: "pas d'image cover" }
    }
  }
}

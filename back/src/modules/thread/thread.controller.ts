import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  Request,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Put,
} from '@nestjs/common'

import { FileInterceptor } from '@nestjs/platform-express'
import { ReplyDto, ThreadDto } from './thread.dto'
import { ThreadService } from './thread.service'

import { AuthGuard } from '@nestjs/passport'
import { AuthService } from '../auth/auth.service'
import { multerOptions } from 'src/utils/multer.config'

@Controller('thread')
export class ThreadController {
  constructor(
    readonly threadService: ThreadService,
    readonly authService: AuthService,
  ) {}
  @Get()
  getAll() {
    return this.threadService.find()
  }

  @Get('reply')
  async getAllReply() {
    return this.threadService.getAllReplies()
  }

  @Put('reply/:id')
  async updateReply(
    @Param('id') id: number,
    @Request() req,
    @Body() reply: any,
  ) {
    reply.userId = await this.authService.getMyIdFromToken(
      req.headers.authorization,
    )
    reply.id = id
    return this.threadService.updateReply(reply)
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.threadService.find(id)
  }

  @Get('images/:imgpath')
  seeUploadedFile(@Param('imgpath') image, @Res() res) {
    return res.sendFile(image, { root: 'data/pictures/thread' })
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async create(
    @Request() req,
    @Body() post: ThreadDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (file) {
      post.imagePath = file.path
    }
    const userId = await this.authService.getMyIdFromToken(
      req.headers.authorization,
    )
    return this.threadService.createThread(post, userId)
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async update(
    @Body() post: any,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Param('id') id: number,
  ) {
    try {
      const userId = await this.authService.getMyIdFromToken(
        req.headers.authorization,
      )

      if (file) {
        post.imagePath = file.path
      }

      return this.threadService.createThread(post, userId, id)
    } catch (error) {
      throw error
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Request() req) {
    const userId = await this.authService.getMyIdFromToken(
      req.headers.authorization,
    )
    return this.threadService.delete(id, userId)
  }

  @Post(':id')
  async createReply(
    @Request() req,
    @Param('id') id: number,
    @Body() reply: ReplyDto,
  ) {
    const userId = await this.authService.getMyIdFromToken(
      req.headers.authorization,
    )
    return this.threadService.createReply(reply, userId, id)
  }

  @Delete('reply/:id')
  async deleteReply(@Param('id') id: number, @Request() req) {
    const userId = await this.authService.getMyIdFromToken(
      req.headers.authorization,
    )
    return this.threadService.deleteReply(id, userId)
  }

  @Post('like/:id')
  @UseGuards(AuthGuard('jwt'))
  async addLike(
    @Request() req,
    @Param('id') id: number,
    @Body() reply: ReplyDto,
  ) {
    const userId = await this.authService.getMyIdFromToken(
      req.headers.authorization,
    )
    return this.threadService.addLike(userId, id)
  }
}

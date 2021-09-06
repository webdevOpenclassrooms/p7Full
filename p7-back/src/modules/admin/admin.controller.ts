import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { PutAdminDto } from './admin.dto'
import { AdminService } from './admin.service'
import { AdminGuard } from 'src/guards/admin.guard'

@Controller('admin')
export class AdminController {
  constructor(readonly adminService: AdminService) {}

  @Put()
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AdminGuard)
  putAdmin(@Body() putAdminDto: PutAdminDto) {
    return this.adminService.putAdmin(putAdminDto)
  }

  @Get('user')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AdminGuard)
  getAllUser() {
    return this.adminService.getAllUser()
  }

  @Get('auth')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AdminGuard)
  getAllAuth() {
    return this.adminService.getAllAuth()
  }

  @Put('logoutUser/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AdminGuard)
  deleteRefreshToken(@Param('id') id: number) {
    return this.adminService.deleteRefreshToken(id)
  }

  @Put('reset/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AdminGuard)
  resetPassword(@Param('id') id: number) {
    return this.adminService.resetPassword(id)
  }

  @Put('thread/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AdminGuard)
  editThread(@Param('id') id: number, @Body() thread: any) {
    return this.adminService.editThread(id, thread)
  }

  @Put('reply/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseGuards(AdminGuard)
  editReply(@Param('id') id: number, @Body() reply: any) {
    return this.adminService.editReply(id, reply)
  }

  @Delete('thread/:id')
  async delete(@Param('id') id: number) {
    return this.adminService.deleteThread(id)
  }
}

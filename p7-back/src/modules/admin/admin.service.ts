import { Injectable } from '@nestjs/common'
const randToken = require('rand-token')
const fs = require('fs')

import { UserDto, UserProfile, PutAdminDto } from './admin.dto'
import Profile from 'src/db/profile.entity'
import User from 'src/db/user.entity'
import Auth from 'src/db/auth.entity'
import { AuthService } from '../auth/auth.service'
import { ThreadDto } from '../thread/thread.dto'
import Thread from 'src/db/thread.entity'
import ThreadReply from 'src/db/threadReply.entity'

@Injectable()
export class AdminService {
  constructor(private authService: AuthService) {}
  async putAdmin(putAdminDto: PutAdminDto) {
    try {
      const { id } = putAdminDto
      await User.update(id, putAdminDto)
      return putAdminDto
    } catch (error) {
      return error
    }
  }

  async getAllUser(): Promise<User[]> {
    return await User.find()
  }

  async getAllAuth(): Promise<Auth[]> {
    return await Auth.find()
  }

  async update(id: number, userProfile: UserProfile): Promise<any> {
    try {
      const { username, imageProfile, ...profileDto } = userProfile
      const userDto: UserDto = { username, imageProfile }
      await User.update(id, userDto)
      await Profile.update(id, profileDto)

      return
    } catch (error) {
      return error
    }
  }

  async deleteRefreshToken(id: number): Promise<void> {
    await Auth.update(id, { refreshtoken: null })
  }

  async resetPassword(id: number): Promise<string> {
    const newPassword = randToken.generate(16)
    return await this.authService.updatePassword(id, newPassword)
  }

  async editThread(id: number, thread: ThreadDto) {
    await Thread.update(id, thread)
    return Thread.findOne(id)
  }

  async editReply(id: number, reply: { content: string }) {
    await ThreadReply.update(id, reply)
    return ThreadReply.findOne(id)
  }

  async deleteThread(id: number) {
    const thread = await Thread.findOne(id)
    if (!thread) {
      return 'no thread'
    }
    this.deletePicture(thread)
    await Thread.delete(id)
    return `Thread ${id} supprimé`
  }

  async deletePicture(thread: Thread) {
    const { imagePath } = thread
    if (imagePath) {
      try {
        fs.unlinkSync(imagePath)
      } catch (err) {
        console.error(err)
      }
    }
  }
}

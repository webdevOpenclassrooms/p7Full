import { Injectable } from '@nestjs/common'
import { UserDto, UserProfile, ProfileDto } from './user.dto'
const fs = require('fs')

import Profile from 'src/db/profile.entity'
import User from 'src/db/user.entity'

@Injectable()
export class UserService {
  async findOne(id: number): Promise<User> {
    return await User.findOne(id)
  }

  async update(id: number, userProfile: any): Promise<any> {
    if (userProfile.avatar) {
      this.deleteAvatar(id)
    }
    const user = await this.findOne(id)

    let { username, avatar, ...profile } = userProfile

    if (!username) {
      username = user.username
    }
    if (!avatar) {
      avatar = user.avatar
    }
    if (Object.keys(profile).length !== 0) {
      await Profile.update(id, profile)
    }

    const userDto: UserDto = { username, avatar }
    await User.update(id, userDto)

    return this.findOneProfile(id)
  }

  async cover(id: number, path: string): Promise<any> {
    this.deleteCover(id)
    await Profile.update(id, { imageCover: path })
    return this.findOneProfile(id)
  }

  async getAllProfile(): Promise<Profile[]> {
    return await Profile.find()
  }

  async findOneProfile(id: number): Promise<Profile> {
    return await Profile.findOne(id)
  }

  async deleteAvatar(id: number): Promise<void> {
    const user = await this.findOne(id)
    if (user?.avatar) {
      this.deletePicture(user.avatar)
    }
  }

  async deleteCover(id: number): Promise<void> {
    const user = await this.findOneProfile(id)
    if (user?.imageCover) {
      this.deletePicture(user.imageCover)
    }
  }

  async deletePicture(imagePath: string): Promise<void> {
    try {
      fs.unlinkSync(imagePath)
    } catch (err) {
      console.error(err)
    }
  }
}

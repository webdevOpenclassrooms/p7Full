import { Injectable } from '@nestjs/common'

import * as bcrypt from 'bcrypt'
const fs = require('fs')
import { JwtService } from '@nestjs/jwt'
const jwt = require('jsonwebtoken')
const randToken = require('rand-token')

import Auth from 'src/db/auth.entity'
import User from 'src/db/user.entity'
import Profile from 'src/db/profile.entity'
import Thread from 'src/db/thread.entity'
import { AuthDto, AuthOrToken, checkMyTokenDto, SignupDto } from './auth.dto'
import { throwError } from 'rxjs'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async hash(password: string): Promise<string> {
    const saltOrRounds = 10
    const hash = await bcrypt.hash(password, saltOrRounds)
    return hash
  }

  async findOne(id: number): Promise<Auth> {
    return await Auth.findOne(id)
  }

  async signup(authDto: SignupDto): Promise<[Auth, User] | any> {
    try {
      const auth: Auth = new Auth()
      auth.email = authDto.email
      auth.password = await this.hash(authDto.password)

      const user: User = new User()
      user.username = authDto.username
      auth.user = user

      // ajoute le admin  user en admin
      if (auth.email === 'admin@mail.com') {
        user.isAdmin = true
      }

      const profile: Profile = new Profile()
      user.profile = profile
      await Auth.save(auth)
      return [auth, user]
    } catch (error) {
      return throwError(error)
    }
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await Auth.findOne({
      where: { email: username },
    })

    const isMatching = await bcrypt.compare(password, user.password)
    if (isMatching) {
      return user
    }
    return null
  }

  async updatePassword(id: number, password: string): Promise<any> {
    await Auth.update(id, {
      password: await this.hash(password),
    })
    return { newPassword: password }
  }

  async createToken(authOrToken: AuthOrToken): Promise<any> {
    const id = authOrToken.id ? authOrToken.id : authOrToken.userId
    const user = await User.findOne(id)
    const avatar = 'avatar' in user ? user.avatar : null

    const payload = {
      userId: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      avatar,
    }

    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: await this.generateRefreshToken(user.id),
    }
  }

  async generateRefreshToken(userId: number): Promise<string> {
    const refreshToken = randToken.generate(16)
    const expirydate = new Date()
    expirydate.setDate(expirydate.getDate() + +process.env.REFRESH_EXPIRATION)

    await this.saveOrUpdateRefreshToken(refreshToken, userId, expirydate)
    return refreshToken
  }

  async saveOrUpdateRefreshToken(
    refreshtoken: string,
    id: number,
    refreshtokenexpires: Date,
  ) {
    await Auth.update(id, {
      refreshtoken,
      refreshtokenexpires,
    })
  }

  async delete(id: number): Promise<{ message: string }> {
    if ((await Auth.findOne(id)) === undefined || id == 1) {
      return { message: `no user ${id}` }
    }
    await this.deletePictures(id)
    await Auth.delete(id)
    return { message: `Delete ${id}` }
  }

  async getUserPictures(id: number): Promise<string[]> {
    let imagesPath = []
    const threads = await Thread.createQueryBuilder('thread')
      .where('thread.user.id = :id', { id: id })
      .andWhere('thread.imagePath IS NOT NULL')
      .getMany()
    threads.map((thread) => imagesPath.push(thread.imagePath))
    return imagesPath
  }

  async deletePictures(id: number) {
    const pictures = await this.getUserPictures(id)
    try {
      pictures.map((picture) => fs.unlinkSync(picture))
      return `images supprimées: ${pictures}`
    } catch (err) {
      console.error(err)
    }
  }

  public async getMyIdFromToken(headers: string): Promise<number> {
    const {
      message: { userId },
    } = await this.checkMyToken(headers)
    return userId
  }

  async checkMyToken(headers: string): Promise<checkMyTokenDto> {
    const token = headers.split(' ')[1]
    const message = jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return err
      }
      return decoded
    })

    return { message }
  }
}

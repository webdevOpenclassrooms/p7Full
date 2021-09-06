import { Module } from '@nestjs/common'

import { UserService } from './user.service'
import { profileController, UserController } from './user.controller'

import { AuthService } from '../auth/auth.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [UserController, profileController],
  providers: [UserService, AuthService],
})
export class UserModule {}

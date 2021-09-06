import { Module } from '@nestjs/common'

import { AuthModule } from '../auth/auth.module'
import { ThreadController } from './thread.controller'
import { ThreadService } from './thread.service'

@Module({
  imports: [AuthModule],
  controllers: [ThreadController],
  providers: [ThreadService],
})
export class ThreadModule {}

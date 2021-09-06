import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'

import { UserModule } from './modules/user/user.module'
import { AuthModule } from './modules/auth/auth.module'
import { AdminModule } from './modules/admin/admin.module'
import { ThreadModule } from './modules/thread/thread.module'
import { DataModule } from './modules/data/data.module'
import { ConfigModule } from '@nestjs/config'
import configuration from 'config/configuration'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),

    TypeOrmModule.forRoot({
      // @ts-ignore
      type: process.env.DB_TYPE, //sqlite
      database: process.env.DB_FOLDER,
      synchronize: true,
      autoLoadEntities: true,
      entities: ['dist/src/db/*.entity.js'],
      cli: {
        entitiesDir: 'src/db',
      },
    }),

    ThrottlerModule.forRoot({
      ttl: +process.env.THROTTLER_TTL, // 60
      limit: +process.env.THROTTLER_LIMIT, // 10,
    }),
    AdminModule,
    AuthModule,
    ThreadModule,
    UserModule,
    DataModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

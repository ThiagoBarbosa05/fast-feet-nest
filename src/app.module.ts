import { Module } from '@nestjs/common'
import { HttpModule } from './infra/http/http.module'
import { PrismaService } from './infra/database/prisma/prisma.service'
import { EnvModule } from './infra/env/env.module'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './infra/env/env'
import { AuthModule } from './infra/auth/auth.module'
import { EventsModule } from './infra/events/events.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
    EventsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}

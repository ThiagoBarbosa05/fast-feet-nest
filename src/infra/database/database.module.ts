import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { AdministratorRepository } from '@/domain/shipping-company/application/repositories/administrator'
import { PrismaAdministratorRepository } from './prisma/repositories/prisma-administrator-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AdministratorRepository,
      useClass: PrismaAdministratorRepository,
    },
  ],
  exports: [PrismaService, AdministratorRepository],
})
export class DatabaseModule {}

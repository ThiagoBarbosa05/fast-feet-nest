import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { AdministratorRepository } from '@/domain/shipping-company/application/repositories/administrator'
import { PrismaAdministratorRepository } from './prisma/repositories/prisma-administrator-repository'
import { DeliverymanRepository } from '@/domain/shipping-company/application/repositories/deliveryman'
import { PrismaDeliverymanRepository } from './prisma/repositories/prisma-deliveryman-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AdministratorRepository,
      useClass: PrismaAdministratorRepository,
    },
    {
      provide: DeliverymanRepository,
      useClass: PrismaDeliverymanRepository,
    },
  ],
  exports: [PrismaService, AdministratorRepository, DeliverymanRepository],
})
export class DatabaseModule {}

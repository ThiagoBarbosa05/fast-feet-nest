import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { AdministratorRepository } from '@/domain/shipping-company/application/repositories/administrator'
import { PrismaAdministratorRepository } from './prisma/repositories/prisma-administrator-repository'
import { DeliverymanRepository } from '@/domain/shipping-company/application/repositories/deliveryman'
import { PrismaDeliverymanRepository } from './prisma/repositories/prisma-deliveryman-repository'
import { OrderRepository } from '@/domain/shipping-company/application/repositories/order'
import { PrismaOrderRepository } from './prisma/repositories/prisma-order-repository'
import { RecipientRepository } from '@/domain/shipping-company/application/repositories/recipient'
import { PrismaRecipientRepository } from './prisma/repositories/prisma-recipient-repository'

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
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
    {
      provide: RecipientRepository,
      useClass: PrismaRecipientRepository,
    },
  ],
  exports: [
    PrismaService,
    AdministratorRepository,
    DeliverymanRepository,
    OrderRepository,
    RecipientRepository,
  ],
})
export class DatabaseModule {}

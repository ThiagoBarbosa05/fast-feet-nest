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
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notification-repository'
import { AttachmentsRepository } from '@/domain/shipping-company/application/repositories/attachments'
import { PrismaAttachmentRepository } from './prisma/repositories/prisma-attachment-repository'
import { OrderAttachmentsRepository } from '@/domain/shipping-company/application/repositories/order-attachments'
import { PrismaOrderAttachmentsRepository } from './prisma/repositories/prisma-order-attachment-repository'
import { CacheModule } from '../cache/cache.module'

@Module({
  imports: [CacheModule],
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
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
    {
      provide: AttachmentsRepository,
      useClass: PrismaAttachmentRepository,
    },
    {
      provide: OrderAttachmentsRepository,
      useClass: PrismaOrderAttachmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    AdministratorRepository,
    DeliverymanRepository,
    OrderRepository,
    NotificationsRepository,
    RecipientRepository,
    AttachmentsRepository,
  ],
})
export class DatabaseModule {}

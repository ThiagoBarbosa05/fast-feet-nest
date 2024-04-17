import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnOrderCreated } from '@/domain/notification/subscribers/on-order-created'
import { OnUpdateDeliveryStatus } from '@/domain/notification/subscribers/on-update-delivery-status'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

@Module({
  imports: [DatabaseModule],
  providers: [OnOrderCreated, OnUpdateDeliveryStatus, SendNotificationUseCase],
})
export class EventsModule {}

import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { PrismaService } from '../prisma.service'
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Notification> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    })

    return PrismaNotificationMapper.toDomain(notification)
  }

  async create(notification: Notification) {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.create({
      data,
    })
  }

  async save(notification: Notification) {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.update({
      where: {
        id: notification.id.toString(),
      },
      data,
    })
  }
}

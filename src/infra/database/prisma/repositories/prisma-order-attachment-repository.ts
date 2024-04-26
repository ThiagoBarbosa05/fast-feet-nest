import { OrderAttachmentsRepository } from '@/domain/shipping-company/application/repositories/order-attachments'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { OrderAttachments } from '@/domain/shipping-company/enterprise/entities/order-attachments'
import { PrismaOrderAttachmentMapper } from '../mappers/prisma-order-attachment-mapper'

@Injectable()
export class PrismaOrderAttachmentsRepository
  implements OrderAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async findManyByOrderId(orderId: string) {
    const orderAttachments = await this.prisma.attachment.findMany({
      where: {
        orderId,
      },
    })

    return orderAttachments.map(PrismaOrderAttachmentMapper.toDomain)
  }

  async createMany(attachments: OrderAttachments[]): Promise<void> {
    if (attachments.length === 0) return

    const data = PrismaOrderAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: OrderAttachments[]): Promise<void> {
    if (attachments.length === 0) return

    const attachmentsIds = attachments.map((attachment) => {
      return attachment.id.toString()
    })

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    })
  }
}

import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { OrderAttachments } from '@/domain/shipping-company/enterprise/entities/order-attachments'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaOrderAttachmentMapper {
  static toDomain(raw: PrismaAttachment): OrderAttachments {
    if (!raw.orderId) {
      throw new Error('Invalid attachment type.')
    }

    return OrderAttachments.create(
      {
        attachmentId: new UniqueEntityID(raw.id),
        orderId: new UniqueEntityID(raw.orderId),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdateMany(
    attachments: OrderAttachments[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsId = attachments.map((attachment) => {
      return attachment.attachmentId.toString()
    })

    return {
      where: {
        id: {
          in: attachmentsId,
        },
      },
      data: {
        orderId: attachments[0].orderId.toString(),
      },
    }
  }
}

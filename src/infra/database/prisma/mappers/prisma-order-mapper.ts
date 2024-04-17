import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { Order } from '@/domain/shipping-company/enterprise/entities/orders'
import { Order as PrismaOrder, Prisma } from '@prisma/client'

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        deliveryStatus: 'waiting',
        recipientId: new UniqueEntityID(raw.recipientId),
        collectedAt: raw.collectedAt,
        deliveredAt: raw.deliveredAt,
        returnedAt: raw.returnedAt,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      deliveryStatus: order.deliveryStatus,
      recipientId: order.recipientId.toString(),
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}

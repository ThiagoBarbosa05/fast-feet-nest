import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import {
  Order,
  OrderProps,
} from '@/domain/shipping-company/enterprise/entities/orders'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      recipientId: new UniqueEntityID(),
      deliveryStatus: 'waiting',
      ...override,
    },
    id,
  )

  return order
}

@Injectable()
export class OrderFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaOrder(data: Partial<OrderProps> = {}) {
    const order = makeOrder(data)

    const orderOnDatabase = await this.prisma.order.create({
      data: {
        deliveryStatus: order.deliveryStatus,
        recipientId: order.recipientId.toString(),
        deliverymanId: order.deliverymanId?.toString(),
        createdAt: order.createdAt,
      },
    })

    return orderOnDatabase
  }
}

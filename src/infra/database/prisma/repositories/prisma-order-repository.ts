import {
  FindManyNearDeliverymanParams,
  ListManyByDeliverymanIdParams,
  OrderRepository,
} from '@/domain/shipping-company/application/repositories/order'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Order } from '@/domain/shipping-company/enterprise/entities/orders'
import { DomainEvents } from '@/core/events/domain-events'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { Prisma, Order as PrismaOrder } from '@prisma/client'

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async listManyByDeliverymanId({
    deliverymanId,
    page,
  }: ListManyByDeliverymanIdParams) {
    const order = await this.prisma.order.findMany({
      where: {
        deliverymanId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return order.map(PrismaOrderMapper.toDomain)
  }

  findById(orderId: string): Promise<Order> {
    throw new Error('Method not implemented.')
  }

  save(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }

  delete(order: Order): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async getOrderByRecipientId(recipientId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        recipientId,
      },
    })

    if (!order) return null

    return PrismaOrderMapper.toDomain(order)
  }

  async findManyNearDeliveryman({
    latitude,
    longitude,
  }: FindManyNearDeliverymanParams) {
    const order = (await this.prisma.$queryRaw<PrismaOrder[]>`
      SELECT o.*, o.recipient_id AS "recipientId" FROM orders o
      INNER JOIN recipients r ON o.recipient_id = r.id
      INNER JOIN address a ON r.address_id = a.id
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 20
    `) as PrismaOrder[]

    return order.map(PrismaOrderMapper.toDomain)
  }
}

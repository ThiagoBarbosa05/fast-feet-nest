import {
  FindManyNearDeliverymanParams,
  ListManyByDeliverymanIdParams,
  ListManyByRecipientIdParams,
  OrderRepository,
} from '@/domain/shipping-company/application/repositories/order'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Order } from '@/domain/shipping-company/enterprise/entities/orders'
import { DomainEvents } from '@/core/events/domain-events'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'

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

  listManyByDeliverymanId({
    deliverymanId,
    page,
  }: ListManyByDeliverymanIdParams): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }

  listManyByRecipientId({
    recipientId,
    page,
  }: ListManyByRecipientIdParams): Promise<Order[]> {
    throw new Error('Method not implemented.')
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

  findManyNearDeliveryman(
    params: FindManyNearDeliverymanParams,
  ): Promise<Order[]> {
    throw new Error('Method not implemented.')
  }
}

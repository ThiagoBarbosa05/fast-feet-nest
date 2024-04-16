import {
  FindManyNearDeliverymanParams,
  ListManyByDeliverymanIdParams,
  ListManyByRecipientIdParams,
  OrderRepository,
} from '@/domain/shipping-company/application/repositories/order'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Order } from '@/domain/shipping-company/enterprise/entities/orders'

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(private prisma: PrismaService) {}
  async create({ recipientId, deliveryStatus }: Order): Promise<void> {
    await this.prisma.order.create({
      data: {
        recipientId: recipientId.toString(),
        deliveryStatus,
      },
    })
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

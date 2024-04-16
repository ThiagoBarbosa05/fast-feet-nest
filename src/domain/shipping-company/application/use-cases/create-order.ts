import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { DeliveryStatus, Order } from '../../enterprise/entities/orders'
import { OrderRepository } from '../repositories/order'
import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

interface CreateOrderUseCaseRequest {
  deliveryStatus?: DeliveryStatus
  recipientId: string
}

type CreateOrderUseCaseResponse = Either<
  null,
  {
    order: Order
  }
>

@Injectable()
export class CreateOrderUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    deliveryStatus = 'waiting',
    recipientId,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const order = Order.create({
      recipientId: new UniqueEntityID(recipientId),
      deliveryStatus,
    })

    await this.orderRepository.create(order)

    return right({
      order,
    })
  }
}

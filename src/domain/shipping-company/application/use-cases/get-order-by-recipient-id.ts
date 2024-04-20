import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/orders'
import { OrderRepository } from '../repositories/order'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

export interface GetOrdersByRecipientIdUseCaseRequest {
  recipientId: string
}

type GetOrdersByRecipientIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

@Injectable()
export class GetOrderByRecipientIdUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    recipientId,
  }: GetOrdersByRecipientIdUseCaseRequest): Promise<GetOrdersByRecipientIdUseCaseResponse> {
    const order = await this.orderRepository.getOrderByRecipientId(recipientId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    return right({
      order,
    })
  }
}

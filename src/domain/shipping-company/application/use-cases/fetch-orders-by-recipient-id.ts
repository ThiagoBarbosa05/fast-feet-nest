import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/orders'
import { OrderRepository } from '../repositories/order'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export interface FetchOrdersByRecipientIdUseCaseRequest {
  recipientId: string
  page: number
}

type FetchOrdersByRecipientIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order[]
  }
>

export class FetchOrdersByRecipientIdUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    recipientId,
    page,
  }: FetchOrdersByRecipientIdUseCaseRequest): Promise<FetchOrdersByRecipientIdUseCaseResponse> {
    const orders = await this.orderRepository.listManyByRecipientId({
      page,
      recipientId,
    })

    if (!orders) {
      return left(new ResourceNotFoundError())
    }

    if (orders.length <= 0) {
      return left(new ResourceNotFoundError())
    }

    return right({
      order: orders,
    })
  }
}

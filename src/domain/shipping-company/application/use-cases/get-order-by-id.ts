import { Either, left, right } from '@/core/either'
import { OrderDetails } from '../../enterprise/entities/value-objects.ts/order-details'
import { OrderRepository } from '../repositories/order'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

export interface GetOrderByIdUseCaseRequest {
  orderId: string
}

type GetOrderByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: OrderDetails
  }
>

@Injectable()
export class GetOrderByIdUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
  }: GetOrderByIdUseCaseRequest): Promise<GetOrderByIdUseCaseResponse> {
    const order = await this.orderRepository.findOrderDetailsById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    return right({
      order,
    })
  }
}

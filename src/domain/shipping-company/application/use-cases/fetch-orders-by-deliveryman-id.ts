import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/orders'
import { OrderRepository } from '../repositories/order'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface FetchOrdersByDeliverymanIdRequest {
  deliverymanId: string
  page: number
}

type FetchOrdersByDeliverymanIdResponse = Either<
  ResourceNotFoundError,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchOrdersByDeliverymanIdUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    deliverymanId,
    page,
  }: FetchOrdersByDeliverymanIdRequest): Promise<FetchOrdersByDeliverymanIdResponse> {
    const orders = await this.orderRepository.listManyByDeliverymanId({
      page,
      deliverymanId,
    })

    if (!orders) {
      return left(new ResourceNotFoundError())
    }

    return right({
      orders,
    })
  }
}

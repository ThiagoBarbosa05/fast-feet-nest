import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/orders'
import { OrderRepository } from '../repositories/order'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface ListOrderNearDeliverymanAddressUseCaseRequest {
  latitude: number
  longitude: number
}

type ListOrderNearDeliverymanAddressUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order[]
  }
>

export class ListOrderNearDeliverymanAddressUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    latitude,
    longitude,
  }: ListOrderNearDeliverymanAddressUseCaseRequest): Promise<ListOrderNearDeliverymanAddressUseCaseResponse> {
    const ordersNearby = await this.orderRepository.findManyNearDeliveryman({
      latitude,
      longitude,
    })

    if (!ordersNearby) {
      return left(new ResourceNotFoundError())
    }

    return right({
      order: ordersNearby,
    })
  }
}

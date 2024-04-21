import { Either, left, right } from '@/core/either'
import { Order } from '../../enterprise/entities/orders'
import { OrderRepository } from '../repositories/order'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { DeliverymanRepository } from '../repositories/deliveryman'
import { Injectable } from '@nestjs/common'

interface ListOrderNearDeliverymanAddressUseCaseRequest {
  deliverymanId: string
}

type ListOrderNearDeliverymanAddressUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order[]
  }
>

@Injectable()
export class ListOrderNearDeliverymanAddressUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private deliverymanRepository: DeliverymanRepository,
  ) {}

  async execute({
    deliverymanId,
  }: ListOrderNearDeliverymanAddressUseCaseRequest): Promise<ListOrderNearDeliverymanAddressUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    const ordersNearby = await this.orderRepository.findManyNearDeliveryman({
      latitude: deliveryman.address.latitude,
      longitude: deliveryman.address.longitude,
    })

    if (!ordersNearby) {
      return left(new ResourceNotFoundError())
    }

    return right({
      order: ordersNearby,
    })
  }
}

import { Either, left, right } from '@/core/either'
import { OrderRepository } from '../repositories/order'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { Injectable } from '@nestjs/common'

export interface MarkOrderAsPickupUseCaseRequest {
  deliverymanId: string
  orderId: string
}

type MarkOrderAsPickupUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class MarkOrderAsPickupUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    deliverymanId,
    orderId,
  }: MarkOrderAsPickupUseCaseRequest): Promise<MarkOrderAsPickupUseCaseResponse> {
    const orderForPickup = await this.orderRepository.findById(orderId)

    if (!orderForPickup) {
      return left(new ResourceNotFoundError())
    }

    orderForPickup.deliverymanId = new UniqueEntityID(deliverymanId)
    orderForPickup.deliveryStatus = 'collected'

    console.log(orderForPickup)

    await this.orderRepository.save(orderForPickup)

    return right({})
  }
}

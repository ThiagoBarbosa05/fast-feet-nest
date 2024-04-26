import { Either, left, right } from '@/core/either'
import { OrderRepository } from '../repositories/order'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

export interface MarkOrderAsReturnedUseCaseRequest {
  orderId: string
}

type MarkOrderAsReturnedUseCaseResponse = Either<ResourceNotFoundError, object>

@Injectable()
export class MarkOrderAsReturnedUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    orderId,
  }: MarkOrderAsReturnedUseCaseRequest): Promise<MarkOrderAsReturnedUseCaseResponse> {
    const orderReturned = await this.orderRepository.findById(orderId)

    if (!orderReturned) {
      return left(new ResourceNotFoundError())
    }

    orderReturned.deliveryStatus = 'returned'

    await this.orderRepository.save(orderReturned)

    return right({})
  }
}

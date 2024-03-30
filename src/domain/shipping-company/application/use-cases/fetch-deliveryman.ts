import { Either, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman'
import { Deliveryman } from '../../enterprise/entities/deliveryman'

export interface FetchDeliverymanUseCaseRequest {
  page: number
}

type FetchDeliverymanUseCaseResponse = Either<
  null,
  {
    deliveryman: Deliveryman[]
  }
>

export class FetchDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    page,
  }: FetchDeliverymanUseCaseRequest): Promise<FetchDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findMany({ page })

    return right({
      deliveryman,
    })
  }
}

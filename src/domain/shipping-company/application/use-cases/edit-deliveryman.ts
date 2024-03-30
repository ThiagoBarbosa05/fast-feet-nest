import { Either, left, right } from '@/core/either'
import { Address } from '../../enterprise/entities/value-objects.ts/address'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { DeliverymanRepository } from '../repositories/deliveryman'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface EditDeliverymanUseCaseRequest {
  deliverymanId: string
  address?: Address
  password?: string
}

type EditDeliverymanUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliveryman: Deliveryman
  }
>

export class EditDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    deliverymanId,
    address,
    password,
  }: EditDeliverymanUseCaseRequest): Promise<EditDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) return left(new ResourceNotFoundError())

    if (address) {
      deliveryman.address = new Address(
        address.street,
        address.city,
        address.state,
        address.zipCode,
        address.latitude,
        address.longitude,
      )
    }

    if (password && password !== deliveryman.password) {
      deliveryman.password = password
    }

    await this.deliverymanRepository.save(deliveryman)

    return right({
      deliveryman,
    })
  }
}

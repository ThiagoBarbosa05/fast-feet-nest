import { Either, left, right } from '@/core/either'
import { Address } from '../../enterprise/entities/value-objects.ts/address'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { DeliverymanRepository } from '../repositories/deliveryman'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../cryptography/hash-generator'

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

@Injectable()
export class EditDeliverymanUseCase {
  constructor(
    private deliverymanRepository: DeliverymanRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    deliverymanId,
    address,
    password,
  }: EditDeliverymanUseCaseRequest): Promise<EditDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)
    const hashedPassword = await this.hashGenerator.hash(password)

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

    deliveryman.password = hashedPassword

    await this.deliverymanRepository.save(deliveryman)

    return right({
      deliveryman,
    })
  }
}

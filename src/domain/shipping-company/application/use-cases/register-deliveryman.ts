import { Either, left, right } from '@/core/either'
import { Address } from '../../enterprise/entities/value-objects.ts/address'
import { Document } from '../../enterprise/entities/value-objects.ts/document'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { HashGenerator } from '../cryptography/hash-generator'
import { DeliverymanRepository } from '../repositories/deliveryman'
import { InvalidDocumentError } from './errors/invalid-document-error'
import { DeliverymanAlreadyExistsError } from './errors/deliveryman-already-exists-error'
import { Injectable } from '@nestjs/common'

interface RegisterDeliverymanUseCaseRequest {
  name: string
  document: string
  password: string
  address: Address
}

type RegisterDeliverymanUseCaseResponse = Either<
  DeliverymanAlreadyExistsError | InvalidDocumentError,
  {
    deliveryman: Deliveryman
  }
>

@Injectable()
export class RegisterDeliverymanUseCase {
  constructor(
    private hashGenerator: HashGenerator,
    private deliverymanRepository: DeliverymanRepository,
  ) {}

  async execute({
    address,
    document,
    name,
    password,
  }: RegisterDeliverymanUseCaseRequest): Promise<RegisterDeliverymanUseCaseResponse> {
    const hashedPassword = await this.hashGenerator.hash(password)
    const deliverymanDocument = new Document(document)

    if (!deliverymanDocument.validateCpf()) {
      return left(new InvalidDocumentError())
    }

    const deliverymanAlreadyExists =
      await this.deliverymanRepository.findByDocument(
        deliverymanDocument.toValue(),
      )

    if (deliverymanAlreadyExists) {
      return left(new DeliverymanAlreadyExistsError())
    }

    const deliverymanAddress = new Address(
      address.street,
      address.city,
      address.state,
      address.zipCode,
      address.latitude,
      address.longitude,
    )

    const deliveryman = Deliveryman.create({
      address: deliverymanAddress,
      document: deliverymanDocument,
      name,
      password: hashedPassword,
    })

    await this.deliverymanRepository.create(deliveryman)

    return right({
      deliveryman,
    })
  }
}

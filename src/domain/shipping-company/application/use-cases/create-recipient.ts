import { Either, left, right } from '@/core/either'
import { Address } from '../../enterprise/entities/value-objects.ts/address'
import { Document } from '../../enterprise/entities/value-objects.ts/document'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientRepository } from '../repositories/recipient'
import { InvalidDocumentError } from './errors/invalid-document-error'
import { Injectable } from '@nestjs/common'

interface CreateRecipientUseCaseRequest {
  name: string
  document: string
  address: Address
}

type CreateRecipientUseCaseResponse = Either<
  InvalidDocumentError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    address,
    document,
    name,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const recipientDocument = new Document(document.toString())

    if (!recipientDocument.validateCpf()) {
      return left(new InvalidDocumentError())
    }

    const RecipientAddress = new Address(
      address.city,
      address.state,
      address.street,
      address.zipCode,
      address.latitude,
      address.longitude,
    )

    const recipient = Recipient.create({
      address: RecipientAddress,
      document: recipientDocument,
      name,
    })

    await this.recipientRepository.create(recipient)

    return right({
      recipient,
    })
  }
}

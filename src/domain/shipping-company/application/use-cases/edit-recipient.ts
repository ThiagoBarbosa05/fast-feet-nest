import { Either, left, right } from '@/core/either'
import { Address } from '../../enterprise/entities/value-objects.ts/address'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { RecipientRepository } from '../repositories/recipient'
import { Document } from '../../enterprise/entities/value-objects.ts/document'
import { InvalidDocumentError } from './errors/invalid-document-error'

interface EditRecipientUseCaseRequest {
  recipientId: string
  address: Address
  document: string
  name: string
}

type EditRecipientUseCaseResponse = Either<
  ResourceNotFoundError | InvalidDocumentError,
  object
>

export class EditRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    address,
    document,
    name,
    recipientId,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const recipientToEdit = await this.recipientRepository.findById(recipientId)

    if (!recipientToEdit) {
      return left(new ResourceNotFoundError())
    }

    const documentToEdit = new Document(document)

    if (!documentToEdit.validateCpf()) {
      return left(new InvalidDocumentError())
    }

    recipientToEdit.address = address
    recipientToEdit.document = documentToEdit
    recipientToEdit.name = name

    await this.recipientRepository.save(recipientToEdit)

    return right({})
  }
}

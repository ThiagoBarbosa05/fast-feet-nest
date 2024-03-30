import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import {
  Recipient,
  RecipientProps,
} from '@/domain/shipping-company/enterprise/entities/recipient'
import { Address } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/address'
import { Document } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/document'
import { faker } from '@faker-js/faker'
import { generateRandomCPF } from 'test/utils/generate-random-cpf'

export function makeRecipient(
  override: Partial<RecipientProps> = {},
  id?: UniqueEntityID,
) {
  const recipient = Recipient.create(
    {
      document: new Document(generateRandomCPF()),
      name: faker.person.fullName(),
      address: new Address(
        faker.location.street(),
        faker.location.city(),
        faker.location.state(),
        faker.location.zipCode(),
        faker.location.latitude(),
        faker.location.longitude(),
      ),
      orderId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return recipient
}

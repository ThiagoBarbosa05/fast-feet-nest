import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import {
  Deliveryman,
  DeliverymanProps,
} from '@/domain/shipping-company/enterprise/entities/deliveryman'
import { Address } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/address'
import { Document } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/document'
import { faker } from '@faker-js/faker'
import { generateRandomCPF } from 'test/utils/generate-random-cpf'

export function makeDeliveryman(
  override: Partial<DeliverymanProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryman = Deliveryman.create(
    {
      name: faker.person.fullName(),
      document: new Document(generateRandomCPF()),
      address: new Address(
        faker.location.street(),
        faker.location.city(),
        faker.location.state(),
        faker.location.zipCode(),
        faker.location.latitude(),
        faker.location.longitude(),
      ),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return deliveryman
}

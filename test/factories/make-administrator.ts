import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import {
  Administrator,
  AdministratorProps,
} from '@/domain/shipping-company/enterprise/entities/administrator'
import { Document } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/document'
import { faker } from '@faker-js/faker'
import { generateRandomCPF } from 'test/utils/generate-random-cpf'
export function makeAdministrator(
  override: Partial<AdministratorProps> = {},
  id?: UniqueEntityID,
) {
  const administrator = Administrator.create(
    {
      name: faker.person.fullName(),
      document: new Document(generateRandomCPF()),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return administrator
}

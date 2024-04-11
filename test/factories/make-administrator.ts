import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import {
  Administrator,
  AdministratorProps,
} from '@/domain/shipping-company/enterprise/entities/administrator'
import { Document } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/document'
import { PrismaAdministratorMapper } from '@/infra/database/prisma/mappers/prisma-administrator-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
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

@Injectable()
export class AdministratorFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdministrator(data: Partial<AdministratorProps> = {}) {
    const administrator = makeAdministrator(data)

    const administratorOnDatabase = await this.prisma.user.create({
      data: {
        ...PrismaAdministratorMapper.toPrisma(administrator),
        role: 'ADMINISTRATOR',
      },
    })

    return administratorOnDatabase
  }
}

import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import {
  Deliveryman,
  DeliverymanProps,
} from '@/domain/shipping-company/enterprise/entities/deliveryman'
import { Address } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/address'
import { Document } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/document'
import { PrismaDeliverymanMapper } from '@/infra/database/prisma/mappers/prisma-deliveryman-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
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

@Injectable()
export class DeliverymanFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaDeliveryman(
    data: Partial<DeliverymanProps> = {},
  ): Promise<Deliveryman> {
    const deliveryman = makeDeliveryman(data)

    await this.prisma.user.create({
      data: PrismaDeliverymanMapper.toPrisma(deliveryman),
    })

    return deliveryman
  }
}

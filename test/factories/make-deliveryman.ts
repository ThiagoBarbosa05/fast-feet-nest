import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import {
  Deliveryman,
  DeliverymanProps,
} from '@/domain/shipping-company/enterprise/entities/deliveryman'
import { Address } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/address'
import { Document } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/document'
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

  async makePrismaDeliveryman(data: Partial<DeliverymanProps> = {}) {
    const deliveryman = makeDeliveryman(data)

    const address = await this.prisma.address.create({
      data: {
        city: deliveryman.address.city,
        street: deliveryman.address.street,
        state: deliveryman.address.state,
        zipCode: deliveryman.address.zipCode,
        latitude: deliveryman.address.latitude,
        longitude: deliveryman.address.longitude,
      },
    })

    const deliverymanOnDatabase = await this.prisma.user.create({
      data: {
        document: deliveryman.document.toString(),
        name: deliveryman.name,
        password: deliveryman.password,
        role: 'DELIVERYMAN',
        addressId: address.id,
      },
    })

    return deliverymanOnDatabase
  }
}

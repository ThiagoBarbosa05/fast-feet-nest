import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import {
  Recipient,
  RecipientProps,
} from '@/domain/shipping-company/enterprise/entities/recipient'
import { Address } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/address'
import { Document } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/document'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
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
      ...override,
    },
    id,
  )

  return recipient
}

@Injectable()
export class RecipientFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaRecipient(data: Partial<RecipientProps> = {}) {
    const recipient = makeRecipient(data)

    const address = await this.prisma.address.create({
      data: {
        city: recipient.address.city,
        street: recipient.address.street,
        state: recipient.address.state,
        zipCode: recipient.address.zipCode,
        latitude: recipient.address.latitude,
        longitude: recipient.address.longitude,
      },
    })

    const recipientOnDatabase = await this.prisma.recipient.create({
      data: {
        document: new Document(recipient.document.toString()).toString(),
        name: recipient.name,
        addressId: address.id,
      },
    })

    await this.prisma.order.create({
      data: {
        recipientId: recipientOnDatabase.id,
        deliveryStatus: 'waiting',
      },
    })

    return recipientOnDatabase
  }
}

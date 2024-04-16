import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { Recipient } from '@/domain/shipping-company/enterprise/entities/recipient'
import { Document } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/document'
import { User as PrismaUser, Prisma } from '@prisma/client'

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaUser): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        document: new Document(raw.document),
        address: null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      document: recipient.document.toString(),
      addressId: null,
    }
  }
}

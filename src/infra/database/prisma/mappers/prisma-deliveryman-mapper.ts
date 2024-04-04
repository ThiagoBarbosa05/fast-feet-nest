import { UniqueEntityID } from "@/core/entities/uniques-entity-id"
import { Deliveryman } from "@/domain/shipping-company/enterprise/entities/deliveryman"
import { Address } from "@/domain/shipping-company/enterprise/entities/value-objects.ts/address"
import { Document } from "@/domain/shipping-company/enterprise/entities/value-objects.ts/document"
import { User as PrismaUser ,Prisma } from "@prisma/client"

export class PrismaDeliverymanMapper {
  static toDomain(raw: PrismaUser): Deliveryman {
    return Deliveryman.create(
      {
        name: raw.name,
        password: raw.password,
        document: new Document(raw.document),
        address: null
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(admin: Deliveryman): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      document: admin.document.toString(),
      password: admin.password,
    }
  }
}
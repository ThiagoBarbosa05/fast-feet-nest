import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { Deliveryman } from '@/domain/shipping-company/enterprise/entities/deliveryman'
import { Address } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/address'
import { Document } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/document'
import {
  User as PrismaUser,
  Prisma,
  Address as PrismaAddress,
} from '@prisma/client'

interface ToDomainWithAddressParams {
  user: PrismaUser
  address: PrismaAddress
}

export class PrismaDeliverymanMapper {
  static toDomain(raw: PrismaUser): Deliveryman {
    return Deliveryman.create(
      {
        name: raw.name,
        password: raw.password,
        document: new Document(raw.document),
        address: null,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toDomainWithAddress({
    user,
    address,
  }: ToDomainWithAddressParams): Deliveryman {
    const latitude = address.latitude as unknown
    const longitude = address.longitude as unknown

    return Deliveryman.create(
      {
        name: user.name,
        password: user.password,
        document: new Document(user.document),
        address: new Address(
          address.street,
          address.city,
          address.state,
          address.zipCode,
          latitude as number,
          longitude as number,
        ),
      },
      new UniqueEntityID(user.id),
    )
  }

  static toPrisma(deliveryman: Deliveryman): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryman.id.toString(),
      name: deliveryman.name,
      document: deliveryman.document.toString(),
      password: deliveryman.password,
    }
  }
}

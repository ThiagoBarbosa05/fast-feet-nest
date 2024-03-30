import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { Administrator } from '@/domain/shipping-company/enterprise/entities/administrator'
import { Document } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/document'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaAdministratorMapper {
  static toDomain(raw: PrismaUser): Administrator {
    return Administrator.create(
      {
        name: raw.name,
        document: new Document(raw.document),
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(admin: Administrator): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      document: admin.document.toString(),
      password: admin.password,
    }
  }
}

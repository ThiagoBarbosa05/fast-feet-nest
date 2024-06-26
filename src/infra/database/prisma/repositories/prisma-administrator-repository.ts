import { AdministratorRepository } from '@/domain/shipping-company/application/repositories/administrator'
import { Administrator } from '@/domain/shipping-company/enterprise/entities/administrator'
import { PrismaService } from '../prisma.service'
import { PrismaAdministratorMapper } from '../mappers/prisma-administrator-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAdministratorRepository implements AdministratorRepository {
  constructor(private prisma: PrismaService) {}

  async create(administrator: Administrator) {
    const data = PrismaAdministratorMapper.toPrisma(administrator)

    await this.prisma.user.create({
      data: {
        ...data,
        role: 'ADMINISTRATOR',
      },
    })
  }

  async findByDocument(document: string) {
    const administrator = await this.prisma.user.findUnique({
      where: {
        document,
      },
    })

    if (!administrator) {
      return null
    }

    return PrismaAdministratorMapper.toDomain(administrator)
  }
}

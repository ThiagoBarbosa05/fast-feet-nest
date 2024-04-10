import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliverymanRepository } from '@/domain/shipping-company/application/repositories/deliveryman'
import { Deliveryman } from '@/domain/shipping-company/enterprise/entities/deliveryman'
import { PrismaService } from '../prisma.service'
import { PrismaDeliverymanMapper } from '../mappers/prisma-deliveryman-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaDeliverymanRepository implements DeliverymanRepository {
  constructor(private prisma: PrismaService) {}

  async create(deliveryman: Deliveryman) {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.$transaction(async (tx) => {
      const address = await tx.address.create({
        data: {
          city: deliveryman.address.city,
          street: deliveryman.address.street,
          state: deliveryman.address.state,
          zipCode: deliveryman.address.zipCode,
          latitude: deliveryman.address.latitude,
          longitude: deliveryman.address.longitude,
        },
      })

      await tx.user.create({
        data: {
          ...data,
          addressId: address.id,
        },
      })
    })
  }

  async findByDocument(document: string) {
    const deliveryman = await this.prisma.user.findUnique({
      where: {
        document,
        role: 'DELIVERYMAN',
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async findById(deliverymanId: string) {
    const deliveryman = await this.prisma.user.findFirst({
      where: {
        id: deliverymanId,
      },
    })

    if (!deliveryman) return null

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async save(deliveryman: Deliveryman) {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)
    console.log(deliveryman)

    await this.prisma.$transaction(async (tx) => {
      const deliverymanFound = await this.prisma.user.findUnique({
        where: {
          id: data.id,
        },
      })

      await tx.address.update({
        where: {
          id: deliverymanFound.addressId,
        },
        data: {
          city: deliveryman.address.city,
          street: deliveryman.address.street,
          state: deliveryman.address.state,
          zipCode: deliveryman.address.zipCode,
          latitude: deliveryman.address.latitude,
          longitude: deliveryman.address.longitude,
        },
      })

      await tx.user.update({
        where: {
          id: data.id,
        },
        data,
      })
    })
  }

  async delete(deliveryman: Deliveryman) {
    console.log('oi')
  }

  async findMany({ page }: PaginationParams) {
    const deliveryman = await this.prisma.user.findMany({
      where: {
        role: 'DELIVERYMAN',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return deliveryman.map(PrismaDeliverymanMapper.toDomain)
  }
}

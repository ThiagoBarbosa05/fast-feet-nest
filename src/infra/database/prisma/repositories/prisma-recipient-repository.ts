import { RecipientRepository } from '@/domain/shipping-company/application/repositories/recipient'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Recipient } from '@/domain/shipping-company/enterprise/entities/recipient'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper'

@Injectable()
export class PrismaRecipientRepository implements RecipientRepository {
  constructor(private prisma: PrismaService) {}
  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.$transaction(async (tx) => {
      const address = await tx.address.create({
        data: {
          city: recipient.address.city,
          street: recipient.address.street,
          state: recipient.address.state,
          zipCode: recipient.address.zipCode,
          latitude: recipient.address.latitude,
          longitude: recipient.address.longitude,
        },
      })

      await tx.recipient.create({
        data: {
          ...data,
          addressId: address.id,
        },
      })
    })
  }

  async findById(recipientId: string): Promise<Recipient> {
    const recipient = await this.prisma.recipient.findUnique({
      where: { id: recipientId },
    })

    return PrismaRecipientMapper.toDomain(recipient)
  }

  delete(recipient: Recipient): Promise<void> {
    throw new Error('Method not implemented.')
  }

  save(recipient: Recipient): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

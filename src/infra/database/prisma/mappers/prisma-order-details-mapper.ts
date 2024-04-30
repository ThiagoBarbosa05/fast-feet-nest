import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { DeliveryStatus } from '@/domain/shipping-company/enterprise/entities/orders'
import { Address } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/address'
import { OrderDetails } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/order-details'
import {
  Order as PrismaOrder,
  Recipient as PrismaRecipient,
  Address as PrismaAddress,
} from '@prisma/client'

type PrismaOrderDetails = PrismaOrder & {
  recipient: PrismaRecipient & {
    address: PrismaAddress
  }
}

export class PrismaOrderDetailsMapper {
  static toDomain(raw: PrismaOrderDetails): OrderDetails {
    return OrderDetails.create({
      orderId: new UniqueEntityID(raw.id),
      recipientId: new UniqueEntityID(raw.recipientId),
      recipientName: raw.recipient.name,
      deliveryStatus: raw.deliveryStatus as DeliveryStatus,
      address: new Address(
        raw.recipient.address.street,
        raw.recipient.address.city,
        raw.recipient.address.state,
        raw.recipient.address.zipCode,
        raw.recipient.address.latitude as unknown as number,
        raw.recipient.address.longitude as unknown as number,
      ),
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}

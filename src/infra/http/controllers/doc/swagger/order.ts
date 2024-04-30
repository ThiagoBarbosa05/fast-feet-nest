import { Address } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/address'
import { ApiProperty } from '@nestjs/swagger'

export class OrderResponseBody {
  @ApiProperty()
  id: string

  @ApiProperty()
  recipientId: string

  @ApiProperty()
  deliverymanId: string

  @ApiProperty()
  deliveryStatus: string

  @ApiProperty()
  collectedAt: Date

  @ApiProperty()
  deliveredAt: Date

  @ApiProperty()
  returnedAt: Date

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

export class OrderDetailsResponseBody {
  @ApiProperty()
  orderId: string

  @ApiProperty()
  recipientId: string

  @ApiProperty()
  recipientName: string

  @ApiProperty()
  deliveryStatus: string

  @ApiProperty()
  address: Address

  @ApiProperty()
  createdAt: Date

  @ApiProperty()
  updatedAt: Date
}

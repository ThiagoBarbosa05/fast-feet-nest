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

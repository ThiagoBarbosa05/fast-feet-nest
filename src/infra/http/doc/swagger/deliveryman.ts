import { ApiProperty, PickType } from '@nestjs/swagger'

export class Address {
  @ApiProperty()
  street: string

  @ApiProperty()
  city: string

  @ApiProperty()
  state: string

  @ApiProperty()
  zipCode: string

  @ApiProperty()
  latitude: number

  @ApiProperty()
  longitude: number
}

export class DeliverymanBody {
  @ApiProperty()
  name: string

  @ApiProperty({
    description: "Deliveryman's document (CPF)",
  })
  document: string

  @ApiProperty()
  password: string

  @ApiProperty({ type: Address })
  address: Address
}

export class EditDeliverymanBody extends PickType(DeliverymanBody, [
  'password',
  'address',
] as const) {}

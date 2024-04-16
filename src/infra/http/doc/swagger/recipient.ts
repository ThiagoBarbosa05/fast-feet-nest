import { ApiProperty } from '@nestjs/swagger'
import { Address } from './deliveryman'

export class RecipientBody {
  @ApiProperty()
  name: string

  @ApiProperty({
    description: "Recipient's document (CPF)",
  })
  document: string

  @ApiProperty({ type: Address })
  address: Address
}

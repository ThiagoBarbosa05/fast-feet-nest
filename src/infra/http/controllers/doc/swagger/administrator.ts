import { ApiProperty } from '@nestjs/swagger'

export class AdministratorBody {
  @ApiProperty()
  name: string

  @ApiProperty({
    description: "Administrator's document (CPF)",
  })
  document: string

  @ApiProperty()
  password: string
}

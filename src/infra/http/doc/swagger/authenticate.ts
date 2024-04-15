import { ApiProperty } from '@nestjs/swagger'

export class AuthenticateBody {
  @ApiProperty({
    description: "User's document (CPF)",
  })
  document: string

  @ApiProperty()
  password: string
}

export class AuthenticateResponse {
  @ApiProperty({
    description: "User's access token",
  })
  accessToken: string
}

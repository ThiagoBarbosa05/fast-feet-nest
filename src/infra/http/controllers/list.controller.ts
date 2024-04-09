import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'

@Controller('/users')
@UseGuards(JwtAuthGuard)
export class ListController {
  constructor() {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    return user.sub
  }
}

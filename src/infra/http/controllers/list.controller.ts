import { Controller, Get, UseGuards } from '@nestjs/common'

import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import { RoleGuard } from '@/infra/auth/role.guard'

@Controller('/users')
export class ListController {
  constructor() {}

  @Get()
  @Roles(['ADMINISTRATOR'])
  @UseGuards(RoleGuard)
  async handle(@CurrentUser() user: UserPayload) {
    return user
  }
}

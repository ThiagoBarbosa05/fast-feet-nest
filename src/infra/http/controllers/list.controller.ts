import { Controller, Get } from '@nestjs/common'
import { Public } from '@/infra/auth/public'

@Controller('/users')
@Public()
export class ListController {
  constructor() {}

  @Get()
  async handle() {
    return 'ok'
  }
}

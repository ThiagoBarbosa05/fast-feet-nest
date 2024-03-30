import { RegisterAdministratorUseCase } from '@/domain/shipping-company/application/use-cases/register-administrator'
import { Body, Controller, HttpCode, Post } from '@nestjs/common'

@Controller('/register/administrator')
export class RegisterAdministratorController {
  constructor(private registerAdministrator: RegisterAdministratorUseCase) {}

  @Post()
  @HttpCode(201)
  async execute(@Body() body) {
    const { name, document, password } = body

    const result = await this.registerAdministrator.execute({
      name,
      document,
      password,
    })

    console.log(result)
  }
}

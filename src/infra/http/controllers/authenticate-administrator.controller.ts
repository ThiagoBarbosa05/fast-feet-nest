import { AuthenticateAdministratorUseCase } from '@/domain/shipping-company/application/use-cases/authenticate-administrator'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { Public } from '@/infra/auth/public'
import { WrongCredentialsError } from '@/domain/shipping-company/application/use-cases/errors/wrong-credentials-error'

const authenticateBodySchema = z.object({
  document: z.string(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions/admin')
@Public()
export class AuthenticateAdministratorController {
  constructor(
    private authenticateAdministrator: AuthenticateAdministratorUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { document, password } = body

    const result = await this.authenticateAdministrator.execute({
      document,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}

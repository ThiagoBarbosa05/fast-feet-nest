import { AuthenticateDeliverymanUseCase } from '@/domain/shipping-company/application/use-cases/authenticate-deliveryman'
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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
} from '@nestjs/swagger'
import {
  AuthenticateBody,
  AuthenticateResponse,
} from './doc/swagger/authenticate'

const authenticateBodySchema = z.object({
  document: z.string(),
  password: z.string(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(
    private authenticateDeliveryman: AuthenticateDeliverymanUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))

  // Swagger Documentation
  @ApiBody({
    type: AuthenticateBody,
  })
  @ApiCreatedResponse({ type: AuthenticateResponse })
  @ApiUnauthorizedResponse({ description: 'Wrong credentials.' })
  @ApiBadRequestResponse({ description: 'Bad request.' })
  // Swagger Documentation
  async handle(@Body() body: AuthenticateBodySchema) {
    const { document, password } = body

    const result = await this.authenticateDeliveryman.execute({
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

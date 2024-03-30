import { AdministratorAlreadyExistsError } from '@/domain/shipping-company/application/use-cases/errors/administrator-already-exists-error'
import { InvalidDocumentError } from '@/domain/shipping-company/application/use-cases/errors/invalid-document-error'
import { RegisterAdministratorUseCase } from '@/domain/shipping-company/application/use-cases/register-administrator'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const registerAdministratorBodySchema = z.object({
  name: z.string(),
  document: z.string(),
  password: z.string(),
})

type RegisterAdministratorBodySchema = z.infer<
  typeof registerAdministratorBodySchema
>

@Controller('/register/administrator')
export class RegisterAdministratorController {
  constructor(private registerAdministrator: RegisterAdministratorUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerAdministratorBodySchema))
  async execute(@Body() body: RegisterAdministratorBodySchema) {
    const { name, document, password } = body

    const result = await this.registerAdministrator.execute({
      name,
      document,
      password,
    })
    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case AdministratorAlreadyExistsError:
          throw new ConflictException(error.message)
        case InvalidDocumentError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}

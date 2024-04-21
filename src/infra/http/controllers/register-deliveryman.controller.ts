import { RegisterDeliverymanUseCase } from '@/domain/shipping-company/application/use-cases/register-deliveryman'
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
import { Address } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/address'
import { InvalidDocumentError } from '@/domain/shipping-company/application/use-cases/errors/invalid-document-error'

import { Roles } from '@/infra/auth/roles.decorator'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
} from '@nestjs/swagger'
import { DeliverymanBody } from './doc/swagger/deliveryman'
import { DeliverymanAlreadyExistsError } from '@/domain/shipping-company/application/use-cases/errors/deliveryman-already-exists-error'

const registrationDeliverymanBodySchema = z.object({
  name: z.string(),
  password: z.string(),
  document: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
})

type RegistrationDeliverymanBodySchema = z.infer<
  typeof registrationDeliverymanBodySchema
>

@Controller('/register/deliveryman')
@Roles(['ADMINISTRATOR'])
export class RegisterDeliverymanController {
  constructor(private registerDeliveryman: RegisterDeliverymanUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registrationDeliverymanBodySchema))

  // Swagger Documentation
  @ApiBody({ type: DeliverymanBody })
  @ApiConflictResponse({ description: 'Deliveryman already registered.' })
  @ApiBadRequestResponse({ description: 'Invalid document.' })
  @ApiBearerAuth()
  // Swagger Documentation
  async handle(@Body() body: RegistrationDeliverymanBodySchema) {
    const { address, document, name, password } = body

    const result = await this.registerDeliveryman.execute({
      address: new Address(
        address.street,
        address.city,
        address.state,
        address.zipCode,
        address.latitude,
        address.longitude,
      ),
      name,
      password,
      document,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DeliverymanAlreadyExistsError:
          throw new ConflictException(error.message)
        case InvalidDocumentError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}

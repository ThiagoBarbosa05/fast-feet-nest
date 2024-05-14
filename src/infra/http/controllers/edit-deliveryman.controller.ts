import { EditDeliverymanUseCase } from '@/domain/shipping-company/application/use-cases/edit-deliveryman'
import { Address } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/address'
import { Roles } from '@/infra/auth/roles.decorator'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ResourceNotFoundError } from '@/domain/shipping-company/application/use-cases/errors/resource-not-found-error'
import { EditDeliverymanBody } from './doc/swagger/deliveryman'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

const editDeliverymanBodySchema = z.object({
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editDeliverymanBodySchema)

export type EditDeliverymanBodySchema = z.infer<
  typeof editDeliverymanBodySchema
>

@Controller('/deliveryman/:deliverymanId')
@Roles(['ADMINISTRATOR'])
export class EditDeliverymanController {
  constructor(private editDeliveryman: EditDeliverymanUseCase) {}

  @Put()
  @HttpCode(200)

  // Swagger Documentation
  @ApiTags('Admin')
  @ApiBody({ type: EditDeliverymanBody })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse({ description: 'Resource not found.' })
  @ApiBearerAuth()
  // Swagger Documentation
  async handle(
    @Body(bodyValidationPipe) body: EditDeliverymanBodySchema,
    @Param('deliverymanId') deliverymanId: string,
  ) {
    const { address, password } = body

    const result = await this.editDeliveryman.execute({
      deliverymanId,
      address: new Address(
        address.street,
        address.city,
        address.state,
        address.zipCode,
        address.latitude,
        address.longitude,
      ),
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}

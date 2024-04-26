import { CreateOrderUseCase } from '@/domain/shipping-company/application/use-cases/create-order'
import { CreateRecipientUseCase } from '@/domain/shipping-company/application/use-cases/create-recipient'
import { InvalidDocumentError } from '@/domain/shipping-company/application/use-cases/errors/invalid-document-error'
import { Address } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/address'
import { Roles } from '@/infra/auth/roles.decorator'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger'
import { z } from 'zod'
import { RecipientBody } from './doc/swagger/recipient'

const createRecipientAndOrderBodySchema = z.object({
  name: z.string(),
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

type CreateRecipientAndOrderBodySchema = z.infer<
  typeof createRecipientAndOrderBodySchema
>

@Controller('/orders')
@Roles(['ADMINISTRATOR'])
export class CreateRecipientAndOrder {
  constructor(
    private createOrder: CreateOrderUseCase,
    private CreateRecipient: CreateRecipientUseCase,
  ) {}

  @Post()
  @HttpCode(201)

  // Swagger Documentation
  @ApiTags('Fast Feet')
  @ApiBody({ type: RecipientBody })
  @ApiBadRequestResponse({ description: 'Invalid document.' })
  @ApiBearerAuth()
  // Swagger Documentation
  async handle(@Body() body: CreateRecipientAndOrderBodySchema) {
    const { address, document, name } = body

    const result = await this.CreateRecipient.execute({
      address: new Address(
        address.street,
        address.city,
        address.state,
        address.zipCode,
        address.latitude,
        address.longitude,
      ),
      document,
      name,
    })

    if (result.isRight()) {
      await this.createOrder.execute({
        recipientId: result.value.recipient.id.toString(),
      })
    }

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidDocumentError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}

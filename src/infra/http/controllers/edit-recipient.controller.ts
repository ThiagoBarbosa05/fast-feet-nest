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
import { EditRecipientUseCase } from '@/domain/shipping-company/application/use-cases/edit-recipient'
import { Address } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/address'
import { Document } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/document'
import { ResourceNotFoundError } from '@/domain/shipping-company/application/use-cases/errors/resource-not-found-error'
import { InvalidDocumentError } from '@/domain/shipping-company/application/use-cases/errors/invalid-document-error'
import { Roles } from '@/infra/auth/roles.decorator'
import { RecipientBody } from './doc/swagger/recipient'
import {
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'

const editRecipientBodySchema = z.object({
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

export type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema)

@Controller('/recipient/:recipientId')
@Roles(['ADMINISTRATOR'])
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}

  @Put()
  @HttpCode(200)

  // Swagger Documentation
  @ApiBody({ type: RecipientBody })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse({ description: 'Resource not found.' })
  @ApiBearerAuth()
  // Swagger Documentation
  async handle(
    @Body(bodyValidationPipe) body: EditRecipientBodySchema,
    @Param('recipientId') recipientId: string,
  ) {
    const { name, document, address } = body

    const result = await this.editRecipient.execute({
      address: new Address(
        address.street,
        address.city,
        address.state,
        address.zipCode,
        address.latitude,
        address.longitude,
      ),
      recipientId,
      name,
      document: new Document(document).toString(),
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case InvalidDocumentError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}

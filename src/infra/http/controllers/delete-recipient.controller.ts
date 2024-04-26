import { DeleteRecipientUseCase } from '@/domain/shipping-company/application/use-cases/delete-recipient'
import { ResourceNotFoundError } from '@/domain/shipping-company/application/use-cases/errors/resource-not-found-error'
import { Roles } from '@/infra/auth/roles.decorator'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import {
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiTags,
} from '@nestjs/swagger'

@Controller('/recipient/:recipientId')
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}

  @Roles(['ADMINISTRATOR'])
  @Delete()
  @HttpCode(200)

  // Swagger Documentation
  @ApiTags('Fast Feet')
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse({ description: 'Resource not found.' })
  @ApiBearerAuth()
  // Swagger Documentation
  async handle(@Param('recipientId') recipientId: string) {
    const result = await this.deleteRecipient.execute({ recipientId })

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

// @Controller('/deliveryman/:deliverymanId')
// export class DeleteDeliverymanController {
//   constructor(private deleteDeliveryman: DeleteDeliverymanUseCase) {}

//   @Roles(['ADMINISTRATOR'])
//   @Delete()
//   @HttpCode(200)

//   // Swagger Documentation
//   @ApiUnauthorizedResponse()
//   @ApiBadRequestResponse({ description: 'Resource not found.' })
//   @ApiBearerAuth()
//   // Swagger Documentation
//   async handle(@Param('deliverymanId') deliverymanId: string) {
//     const result = await this.deleteDeliveryman.execute({
//       deliverymanId,
//     })

//     if (result.isLeft()) {
//       const error = result.value

//       switch (error.constructor) {
//         case ResourceNotFoundError:
//           throw new BadRequestException(error.message)
//         default:
//           throw new BadRequestException(error.message)
//       }
//     }
//   }
// }

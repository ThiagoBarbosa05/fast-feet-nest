import { DeleteDeliverymanUseCase } from '@/domain/shipping-company/application/use-cases/delete-deliveryman'
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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

@Controller('/deliveryman/:deliverymanId')
export class DeleteDeliverymanController {
  constructor(private deleteDeliveryman: DeleteDeliverymanUseCase) {}

  @Roles(['ADMINISTRATOR'])
  @Delete()
  @HttpCode(200)

  // Swagger Documentation
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse({ description: 'Resource not found.' })
  @ApiBearerAuth()
  // Swagger Documentation
  async handle(@Param('deliverymanId') deliverymanId: string) {
    const result = await this.deleteDeliveryman.execute({
      deliverymanId,
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

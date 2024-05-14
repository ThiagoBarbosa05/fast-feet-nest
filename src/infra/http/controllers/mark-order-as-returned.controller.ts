import { ResourceNotFoundError } from '@/domain/shipping-company/application/use-cases/errors/resource-not-found-error'
import { MarkOrderAsReturnedUseCase } from '@/domain/shipping-company/application/use-cases/mark-order-as-returned'
import { Roles } from '@/infra/auth/roles.decorator'
import { BadRequestException, Controller, Param, Put } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

@Controller('/order/:orderId/return')
@Roles(['DELIVERYMAN'])
export class MarkOrderAsReturnedController {
  constructor(private markOrderAsReturned: MarkOrderAsReturnedUseCase) {}

  @Put()
  // Swagger Documentation
  @ApiTags('Deliveryman')
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  // Swagger Documentation
  async handle(@Param('orderId') orderId: string) {
    const result = await this.markOrderAsReturned.execute({
      orderId,
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

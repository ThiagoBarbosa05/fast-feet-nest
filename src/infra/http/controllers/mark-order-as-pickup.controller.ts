import { ResourceNotFoundError } from '@/domain/shipping-company/application/use-cases/errors/resource-not-found-error'
import { MarkOrderAsPickupUseCase } from '@/domain/shipping-company/application/use-cases/mark-order-as-pickup'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import { BadRequestException, Controller, Param, Put } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

@Controller('/order/:orderId/pickup')
@Roles(['DELIVERYMAN'])
export class MarkOrderAsPickupController {
  constructor(private markOrderAsPickup: MarkOrderAsPickupUseCase) {}

  @Put()
  // Swagger Documentation
  @ApiTags('Deliveryman')
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  // Swagger Documentation
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const result = await this.markOrderAsPickup.execute({
      deliverymanId: user.sub,
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

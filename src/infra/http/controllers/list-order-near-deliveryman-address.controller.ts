import { ResourceNotFoundError } from '@/domain/shipping-company/application/use-cases/errors/resource-not-found-error'
import { ListOrderNearDeliverymanAddressUseCase } from '@/domain/shipping-company/application/use-cases/list-order-near-deliveryman-address'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import { BadRequestException, Controller, Get, HttpCode } from '@nestjs/common'
import { OrderPresenter } from '../presenter/order'
import { OrderResponseBody } from './doc/swagger/order'
import {
  ApiBearerAuth,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

@Controller('/orders')
@Roles(['DELIVERYMAN'])
export class ListOrderNearDeliverymanAddressController {
  constructor(
    private listOrderNearDeliveryman: ListOrderNearDeliverymanAddressUseCase,
  ) {}

  @Get()
  @HttpCode(200)

  // Swagger Documentation
  @ApiBody({ type: [OrderResponseBody] })
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  // Swagger Documentation
  async handle(@CurrentUser() user: UserPayload) {
    const deliverymanId = user.sub

    const result = await this.listOrderNearDeliveryman.execute({
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

    return result.value.order.map(OrderPresenter.toHTTP)
  }
}

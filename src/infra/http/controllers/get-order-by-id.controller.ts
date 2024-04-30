import { GetOrderByIdUseCase } from '@/domain/shipping-company/application/use-cases/get-order-by-id'
import { Roles } from '@/infra/auth/roles.decorator'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { OrderDetailsPresenter } from '../presenter/order-details'
import { ResourceNotFoundError } from '@/domain/shipping-company/application/use-cases/errors/resource-not-found-error'
import {
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { OrderDetailsResponseBody } from './doc/swagger/order'

@Controller('/order/:orderId')
@Roles(['ADMINISTRATOR', 'DELIVERYMEN'])
export class GetOrderByIdController {
  constructor(private getOrderById: GetOrderByIdUseCase) {}

  @Get()
  // Swagger Documentation
  @ApiTags('Fast Feet')
  @ApiBody({ type: OrderDetailsResponseBody })
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  // Swagger Documentation
  async handle(@Param('orderId') orderId: string) {
    const result = await this.getOrderById.execute({ orderId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return OrderDetailsPresenter.toHTTP(result.value.order)
  }
}

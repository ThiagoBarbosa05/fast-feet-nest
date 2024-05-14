import { ResourceNotFoundError } from '@/domain/shipping-company/application/use-cases/errors/resource-not-found-error'
import { GetOrderByRecipientIdUseCase } from '@/domain/shipping-company/application/use-cases/get-order-by-recipient-id'
import { Roles } from '@/infra/auth/roles.decorator'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { OrderPresenter } from '../presenter/order'
import { OrderResponseBody } from './doc/swagger/order'
import {
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'

@Controller('/recipient/order/:recipientId')
@Roles(['ADMINISTRATOR'])
export class GetOrderByRecipientIdController {
  constructor(private getOrderByRecipientId: GetOrderByRecipientIdUseCase) {}

  @Get()
  @HttpCode(200)
  @ApiTags('Admin')
  @ApiBody({ type: OrderResponseBody })
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  async handle(@Param('recipientId') recipientId: string) {
    const result = await this.getOrderByRecipientId.execute({ recipientId })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return OrderPresenter.toHTTP(result.value.order)
  }
}

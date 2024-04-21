import { FetchOrdersByDeliverymanIdUseCase } from '@/domain/shipping-company/application/use-cases/fetch-orders-by-deliveryman-id'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { OrderPresenter } from '../presenter/order'
import {
  ApiBearerAuth,
  ApiBody,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { OrderResponseBody } from './doc/swagger/order'

const pageQuerySchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQuerySchema)

type PageQuerySchema = z.infer<typeof pageQuerySchema>

@Controller('/deliveryman/orders/:deliverymanId')
@Roles(['ADMINISTRATOR', 'DELIVERYMAN'])
export class FetchOrdersByDeliverymanIdController {
  constructor(
    private FetchOrdersByDeliverymanId: FetchOrdersByDeliverymanIdUseCase,
  ) {}

  @Get()

  // Swagger Documentation
  @ApiBody({ type: [OrderResponseBody] })
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  // Swagger Documentation
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('deliverymanId') deliverymanId: string,
    @Query('page', queryValidationPipe) page: PageQuerySchema,
  ) {
    if (user.role === 'ADMINISTRATOR') {
      const result = await this.FetchOrdersByDeliverymanId.execute({
        deliverymanId,
        page,
      })

      return result.isRight() && result.value.orders.map(OrderPresenter.toHTTP)
    }

    if (user.role === 'DELIVERYMAN' && deliverymanId === user.sub) {
      const result = await this.FetchOrdersByDeliverymanId.execute({
        deliverymanId,
        page,
      })
      return result.isRight() && result.value.orders.map(OrderPresenter.toHTTP)
    }
    throw new BadRequestException()
  }
}

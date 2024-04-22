import { MarkOrderAsPickupUseCase } from '@/domain/shipping-company/application/use-cases/mark-order-as-pickup'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import { Controller, Param, Put } from '@nestjs/common'

@Controller('/orders/:orderId')
@Roles(['ADMINISTRATOR'])
export class MarkOrderAsPickupController {
  constructor(private markOrderAsPickup: MarkOrderAsPickupUseCase) {}

  @Put()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const result = await this.markOrderAsPickup.execute({
      deliverymanId: user.sub,
      orderId,
    })

    console.log(result)
  }
}

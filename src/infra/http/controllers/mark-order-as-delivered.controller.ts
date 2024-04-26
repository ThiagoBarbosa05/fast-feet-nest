import { MarkOrderAsDeliveredUseCase } from '@/domain/shipping-company/application/use-cases/mark-order-as-delivered'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { Roles } from '@/infra/auth/roles.decorator'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { ResourceNotFoundError } from '@/domain/shipping-company/application/use-cases/errors/resource-not-found-error'
import { NotAllowedError } from '@/domain/shipping-company/application/use-cases/errors/not-allowed-error'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { AttachmentIdBody } from './doc/swagger/attachments'

const markOrderAsDeliveredBodySchema = z.object({
  attachments: z.array(z.string().uuid()),
})

const bodyValidationPipe = new ZodValidationPipe(markOrderAsDeliveredBodySchema)

type MarkOrderAsDeliveredBodySchema = z.infer<
  typeof markOrderAsDeliveredBodySchema
>

@Controller('/order/:orderId/delivery')
@Roles(['DELIVERYMAN'])
export class MarkOrderAsDeliveredController {
  constructor(private markOrderAsDelivered: MarkOrderAsDeliveredUseCase) {}

  @Put()
  @HttpCode(201)
  // Swagger Documentation
  @ApiTags('Fast Feet')
  @ApiBody({ type: [AttachmentIdBody] })
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  // Swagger Documentation
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
    @Body(bodyValidationPipe) body: MarkOrderAsDeliveredBodySchema,
  ) {
    const { attachments } = body

    const result = await this.markOrderAsDelivered.execute({
      orderId,
      deliverymanId: user.sub,
      attachmentsIds: attachments,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}

import { FetchDeliverymanUseCase } from '@/domain/shipping-company/application/use-cases/fetch-deliveryman'
import { Roles } from '@/infra/auth/roles.decorator'
import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeliverymanPresenter } from '../presenter/deliveryman'
import {
  ApiBody,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { DeliverymanBodyResponse } from '../doc/swagger/deliveryman'

const pageQuerySchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQuerySchema)

type PageQuerySchema = z.infer<typeof pageQuerySchema>

@Controller('/deliveryman')
@Roles(['ADMINISTRATOR'])
export class FetchDeliverymanController {
  constructor(private fetchDeliveryman: FetchDeliverymanUseCase) {}

  @Get()

  // Swagger Documentation
  @ApiBody({ type: DeliverymanBodyResponse })
  @ApiUnauthorizedResponse()
  @ApiBearerAuth()
  // Swagger Documentation
  async handle(@Query('page', queryValidationPipe) page: PageQuerySchema) {
    const result = await this.fetchDeliveryman.execute({ page })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { deliveryman } = result.value

    return { deliveryman: deliveryman.map(DeliverymanPresenter.toHTTP) }
  }
}
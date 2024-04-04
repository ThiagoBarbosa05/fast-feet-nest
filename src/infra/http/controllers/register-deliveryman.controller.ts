import { RegisterDeliverymanUseCase } from '@/domain/shipping-company/application/use-cases/register-deliveryman'
import { Body, Controller, HttpCode, Post, UsePipes } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { Address } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/address'

const registrationDeliverymanBodySchema = z.object({
  name: z.string(),
  password: z.string(),
  document: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
})

type RegistrationDeliverymanBodySchema = z.infer<
  typeof registrationDeliverymanBodySchema
>

@Controller('/register/deliveryman')
export class RegisterDeliverymanController {
  constructor(private registerDeliveryman: RegisterDeliverymanUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registrationDeliverymanBodySchema))
  async execute(@Body() body: RegistrationDeliverymanBodySchema) {
    const { address, document, name, password } = body

    const result = await this.registerDeliveryman.execute({
      address: new Address(
        address.street,
        address.city,
        address.state,
        address.zipCode,
        address.latitude,
        address.longitude,
      ),
      name,
      password,
      document,
    })

    console.log(result)
  }
}

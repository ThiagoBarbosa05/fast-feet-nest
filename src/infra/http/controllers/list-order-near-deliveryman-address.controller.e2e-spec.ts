import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { RecipientFactory } from 'test/factories/make-recipient'
import { faker } from '@faker-js/faker'
import { Address } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/address'

describe('List orders nearby deliveryman address (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /orders', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      address: new Address(
        faker.location.street(),
        faker.location.city(),
        faker.location.state(),
        faker.location.zipCode(),
        -22.76925567852189,
        -41.901996120196166,
      ),
    })

    Promise.all([
      await recipientFactory.makePrismaRecipient({
        address: new Address(
          faker.location.street(),
          faker.location.city(),
          faker.location.state(),
          faker.location.zipCode(),
          -22.7674354007673,
          -41.90427063346115,
        ),
      }),
      await recipientFactory.makePrismaRecipient({
        address: new Address(
          faker.location.street(),
          faker.location.city(),
          faker.location.state(),
          faker.location.zipCode(),
          -22.12281990113447,
          -41.34494787735441,
        ),
      }),
    ])

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      role: deliveryman.role,
    })

    const response = await request(app.getHttpServer())
      .get(`/orders`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveLength(1)
    expect(response.body).toEqual([
      expect.objectContaining({ deliveryStatus: 'waiting' }),
    ])
  })
})

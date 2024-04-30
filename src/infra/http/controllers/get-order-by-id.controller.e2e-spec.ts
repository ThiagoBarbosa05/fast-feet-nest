import { AppModule } from '@/app.module'
import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Get order by id (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory
  let orderFactory: OrderFactory
  let recipientFactory: RecipientFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdministratorFactory,
        DeliverymanFactory,
        OrderFactory,
        RecipientFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    orderFactory = moduleRef.get(OrderFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /order/:orderId', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaOrder({
      deliverymanId: new UniqueEntityID(deliveryman.id),
      recipientId: new UniqueEntityID(recipient.id),
    })

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      role: deliveryman.role,
    })

    const response = await request(app.getHttpServer())
      .get(`/order/${order.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({
      orderId: expect.any(String),
    })
  })
})

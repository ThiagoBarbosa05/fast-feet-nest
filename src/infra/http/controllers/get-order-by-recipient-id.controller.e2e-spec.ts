import { AppModule } from '@/app.module'
import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { RecipientFactory } from 'test/factories/make-recipient'
import { OrderFactory } from 'test/factories/make-order'

describe('Get  order by recipient id (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let adminFactory: AdministratorFactory

  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdministratorFactory,
        RecipientFactory,
        OrderFactory,
        AdministratorFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    adminFactory = moduleRef.get(AdministratorFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /recipient/order/:recipientId', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const admin = await adminFactory.makePrismaAdministrator()

    await orderFactory.makePrismaOrder({
      recipientId: new UniqueEntityID(recipient.id),
    })

    const accessToken = jwt.sign({
      sub: admin.id.toString(),
      role: admin.role,
    })

    const response = await request(app.getHttpServer())
      .get(`/recipient/order/${recipient.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toMatchObject({
      recipientId: recipient.id,
    })
  })
})

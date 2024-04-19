import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

describe('Fetch Deliveryman (E2E)', () => {
  let app: INestApplication
  let administratorFactory: AdministratorFactory
  let deliverymanFactory: DeliverymanFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdministratorFactory, DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    administratorFactory = moduleRef.get(AdministratorFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /deliveryman', async () => {
    const admin = await administratorFactory.makePrismaAdministrator()

    Promise.all([
      await deliverymanFactory.makePrismaDeliveryman({
        name: 'Ronaldinho Gaúcho',
      }),
      await deliverymanFactory.makePrismaDeliveryman({
        name: 'Cristiano Ronaldo',
      }),
    ])

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    const response = await request(app.getHttpServer())
      .get('/deliveryman')
      .set('Authorization', `Bearer ${accessToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      deliveryman: expect.arrayContaining([
        expect.objectContaining({ name: 'Ronaldinho Gaúcho' }),
        expect.objectContaining({ name: 'Cristiano Ronaldo' }),
      ]),
    })
  })
})

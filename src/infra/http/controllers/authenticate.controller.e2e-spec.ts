import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { Test } from '@nestjs/testing'
import { Document } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/document'
import { hash } from 'bcryptjs'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliverymanFactory = moduleRef.get(DeliverymanFactory)

    await app.init()
  })

  test('[POST] /sessions (E2E)', async () => {
    await deliverymanFactory.makePrismaDeliveryman({
      document: new Document('8585557339'),
      password: await hash('364556', 8),
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      document: '8585557339',
      password: '364556',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      access_token: expect.any(String),
    })
  })
})

import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

describe('Create Recipient and order (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let administratorFactory: AdministratorFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdministratorFactory, DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    administratorFactory = moduleRef.get(AdministratorFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /orders', async () => {
    const admin = await administratorFactory.makePrismaAdministrator()

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        document: '67224677329',
        address: {
          city: faker.location.city(),
          street: faker.location.street(),
          state: faker.location.state(),
          zipCode: faker.location.zipCode(),
          latitude: faker.location.latitude(),
          longitude: faker.location.longitude(),
        },
      })

    expect(response.statusCode).toBe(201)

    const recipientOnDatabase = await prisma.recipient.findMany()

    const orderOnDatabase = await prisma.order.findMany()

    expect(recipientOnDatabase.length).toEqual(1)
    expect(recipientOnDatabase[0].name).toEqual('John Doe')

    expect(orderOnDatabase.length).toEqual(1)
    expect(orderOnDatabase[0].recipientId).toEqual(recipientOnDatabase[0].id)
  })
})

import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import request from 'supertest'

describe('Register Deliveryman (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /register/deliveryman', async () => {
    const response = await request(app.getHttpServer())
      .post('/register/deliveryman')
      .send({
        name: 'John Doe',
        document: '67224677329',
        password: '364556',
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

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        document: '67224677329',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})

import { AppModule } from '@/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { generateRandomCPF } from 'test/utils/generate-random-cpf'

describe('Register Administrator (E2E)', () => {
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

  test('[POST] /register/administrator', async () => {
    const response = await request(app.getHttpServer())
      .post('/register/administrator')
      .send({
        name: 'John Doe',
        document: '16409526750',
        password: '364556',
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        document: '16409526750',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})

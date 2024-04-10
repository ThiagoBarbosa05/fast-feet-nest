import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { Test } from '@nestjs/testing'
import { Document } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/document'
import { hash } from 'bcryptjs'

describe('Authenticate Administrator (E2E)', () => {
  let app: INestApplication
  let administratorFactory: AdministratorFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdministratorFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    administratorFactory = moduleRef.get(AdministratorFactory)

    await app.init()
  })

  test('[POST] /sessions/admin (E2E)', async () => {
    await administratorFactory.makePrismaAdministrator({
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

import { AppModule } from '@/app.module'
import { DomainEvents } from '@/core/events/domain-events'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { waitFor } from 'test/utils/wait-for'

describe('On order created (E2E)', () => {
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

    DomainEvents.shouldRun = true

    prisma = moduleRef.get(PrismaService)
    administratorFactory = moduleRef.get(AdministratorFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('should be able to send a notification when an order is created', async () => {
    const admin = await administratorFactory.makePrismaAdministrator()

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    await request(app.getHttpServer())
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

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findMany()

      expect(notificationOnDatabase.length).toEqual(1)
    })
  })
})

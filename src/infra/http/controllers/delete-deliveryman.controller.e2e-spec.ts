import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

describe('Delete Deliveryman (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let deliverymanFactory: DeliverymanFactory
  let administratorFactory: AdministratorFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdministratorFactory, DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    administratorFactory = moduleRef.get(AdministratorFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /deliveryman/deliverymanId', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const admin = await administratorFactory.makePrismaAdministrator()

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    const response = await request(app.getHttpServer())
      .delete(`/deliveryman/${deliveryman.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: deliveryman.id,
      },
    })

    expect(response.statusCode).toBe(200)
    expect(userOnDatabase).toBe(null)
  })
})

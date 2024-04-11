import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import request from 'supertest'

describe('Edit Deliveryman (E2E)', () => {
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

  test('PUT /deliveryman/:deliverymanId', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const admin = await administratorFactory.makePrismaAdministrator()

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    const response = await request(app.getHttpServer())
      .put(`/deliveryman/${deliveryman.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: 'new-password',
        address: {
          city: 'Rio de Janeiro',
          state: 'London',
          street: 'Rua x',
          zipCode: '28951739',
          latitude: -22.76046660826777,
          longitude: -41.88949540106056,
        },
      })

    const deliverymanOnDatabase = await prisma.user.findFirst({
      where: {
        id: deliveryman.id,
      },
      include: {
        address: true,
      },
    })

    expect(response.statusCode).toBe(200)
    expect(deliverymanOnDatabase.address.city).toEqual('Rio de Janeiro')
  })
})

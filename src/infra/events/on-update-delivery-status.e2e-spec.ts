import { AppModule } from '@/app.module'
import { DomainEvents } from '@/core/events/domain-events'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { RecipientFactory } from 'test/factories/make-recipient'
import { waitFor } from 'test/utils/wait-for'

describe('On delivery status Updated (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let recipientFactory: RecipientFactory
  let deliverymanFactory: DeliverymanFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    DomainEvents.shouldRun = true

    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('should be able to send a notification when delivery status change.', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const recipient = await recipientFactory.makePrismaRecipient()

    const accessToken = jwt.sign({
      sub: deliveryman.id.toString(),
      role: deliveryman.role,
    })

    const order = await prisma.order.findFirst({
      where: {
        recipientId: recipient.id,
      },
    })

    await request(app.getHttpServer())
      .put(`/orders/${order.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findMany()

      expect(notificationOnDatabase.length).toEqual(1)
    })
  })
})

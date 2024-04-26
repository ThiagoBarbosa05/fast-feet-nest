import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Mark order as delivered (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let recipientFactory: RecipientFactory
  let attachmentFactory: AttachmentFactory
  let deliverymanFactory: DeliverymanFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, RecipientFactory, AttachmentFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  it('[PUT] /order/:orderId', async () => {
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

    const attachmentsCreated = await attachmentFactory.makePrismaAttachment()
    const attachmentsId = attachmentsCreated.id.toValue()

    const response = await request(app.getHttpServer())
      .put(`/order/${order.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachments: [attachmentsId],
      })

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: { orderId: order.id },
    })

    expect(response.statusCode).toEqual(201)
    expect(attachmentsOnDatabase).toHaveLength(1)
  })
})

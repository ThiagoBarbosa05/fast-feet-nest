import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import request from 'supertest'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Delete Recipient (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let recipientFactory: RecipientFactory
  let administratorFactory: AdministratorFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdministratorFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    recipientFactory = moduleRef.get(RecipientFactory)
    administratorFactory = moduleRef.get(AdministratorFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[DELETE] /recipient/recipientId', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const admin = await administratorFactory.makePrismaAdministrator()

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    await request(app.getHttpServer())
      .delete(`/recipient/${recipient.id}`)
      .set('Authorization', `Bearer ${accessToken}`)

    const recipientOnDatabase = await prisma.recipient.findUnique({
      where: {
        id: recipient.id,
      },
    })
    const orderOnDatabase = await prisma.order.findMany()

    expect(recipientOnDatabase).toBeNull()
    expect(orderOnDatabase).toHaveLength(0)
  })
})

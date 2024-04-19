import { AppModule } from '@/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { AdministratorFactory } from 'test/factories/make-administrator'
import { RecipientFactory } from 'test/factories/make-recipient'
import request from 'supertest'

describe('Edit Recipient (E2E)', () => {
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

  test('PUT /recipient/:recipientId', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const admin = await administratorFactory.makePrismaAdministrator()

    const accessToken = jwt.sign({ sub: admin.id.toString(), role: admin.role })

    await request(app.getHttpServer())
      .put(`/recipient/${recipient.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        document: '32250844763',
        address: {
          city: 'Rio de Janeiro',
          state: 'RJ',
          street: 'Rua x',
          zipCode: '28951739',
          latitude: -22.76046660826777,
          longitude: -41.88949540106056,
        },
      })

    const recipientUpdatedOnDatabase = await prisma.recipient.findUnique({
      where: {
        id: recipient.id,
      },
      include: {
        address: true,
      },
    })

    expect(recipientUpdatedOnDatabase.name).toEqual('John Doe')
    expect(recipientUpdatedOnDatabase.document).toEqual('32250844763')
  })
})

import { AppModule } from '@/app.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { RecipientFactory } from 'test/factories/make-recipient'
import { DatabaseModule } from '../../database.module'
import { CacheModule } from '@/infra/cache/cache.module'
import { OrderFactory } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { OrderRepository } from '@/domain/shipping-company/application/repositories/order'

describe('Prisma Order Repository (E2E)', () => {
  let app: INestApplication
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let cacheRepository: CacheRepository
  let orderRepository: OrderRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [RecipientFactory, DeliverymanFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    orderRepository = moduleRef.get(OrderRepository)

    await app.init()
  })

  it('should cache order details', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const order = await orderFactory.makePrismaOrder({
      recipientId: new UniqueEntityID(recipient.id),
    })

    const orderId = order.id

    const orderDetails = await orderRepository.findOrderDetailsById(orderId)

    const cached = await cacheRepository.get(`order:${orderId}:details`)

    expect(cached).toEqual(JSON.stringify(orderDetails))
  })

  it('should return cached order details on subsequent calls', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()
    const order = await orderFactory.makePrismaOrder({
      recipientId: new UniqueEntityID(recipient.id),
    })

    const orderId = order.id

    await cacheRepository.set(
      `order:${orderId}:details`,
      JSON.stringify({ empty: true }),
    )

    const orderDetails = await orderRepository.findOrderDetailsById(orderId)

    expect(orderDetails).toEqual({ empty: true })
  })
})

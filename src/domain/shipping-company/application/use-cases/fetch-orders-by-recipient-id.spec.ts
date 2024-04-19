import { InMemoryOrderRepository } from 'test/repositories/in-memory-order'
import { FetchOrdersByRecipientIdUseCase } from './fetch-orders-by-recipient-id'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository

let inMemoryOrderRepository: InMemoryOrderRepository
let sut: FetchOrdersByRecipientIdUseCase

describe('Fetch orders by recipient id', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    )
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new FetchOrdersByRecipientIdUseCase(inMemoryOrderRepository)
  })

  it('should be able to fetch orders by recipient id', async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientRepository.create(recipient)

    for (let i = 0; i < 2; i++) {
      const orderCreated = makeOrder({
        recipientId: recipient.id,
      })
      await inMemoryOrderRepository.create(orderCreated)
    }

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      order: [
        expect.objectContaining({ deliveryStatus: 'waiting' }),
        expect.objectContaining({ deliveryStatus: 'waiting' }),
      ],
    })
  })

  it('It should not be possible to pick up orders from other recipient', async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientRepository.create(recipient)

    for (let i = 0; i < 5; i++) {
      const orderCreated = makeOrder({
        recipientId: recipient.id,
      })
      await inMemoryOrderRepository.create(orderCreated)
    }

    const wrongRecipientId = 'wrongId'

    const result = await sut.execute({
      recipientId: wrongRecipientId,
      page: 1,
    })

    expect(result.value).toEqual({
      order: [],
    })
  })
})

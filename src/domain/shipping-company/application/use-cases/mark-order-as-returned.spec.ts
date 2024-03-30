import { InMemoryOrderRepository } from 'test/repositories/in-memory-order'
import { MarkOrderAsReturnedUseCase } from './mark-order-as-returned'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { makeOrder } from 'test/factories/make-order'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: MarkOrderAsReturnedUseCase

describe('Mark Order as Returned', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    )
    sut = new MarkOrderAsReturnedUseCase(inMemoryOrderRepository)
  })

  it('should be possible to return the order', async () => {
    const order = makeOrder()

    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0]).toMatchObject({
      deliveryStatus: 'returned',
    })
  })
})

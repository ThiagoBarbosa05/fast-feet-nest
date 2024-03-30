import { InMemoryOrderRepository } from 'test/repositories/in-memory-order'
import { CreateOrderUseCase } from './create-order'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: CreateOrderUseCase

describe('Create an order', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    )

    sut = new CreateOrderUseCase(inMemoryOrderRepository)
  })

  it('should be able to create an order', async () => {
    const result = await sut.execute({
      recipientId: '2',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0]).toEqual(result.value?.order)
  })
})

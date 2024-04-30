import { InMemoryOrderRepository } from 'test/repositories/in-memory-order'
import { DeleteOrderUseCase } from './delete-order'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentsRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: DeleteOrderUseCase

describe('Delete an order', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentsRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
      inMemoryOrderAttachmentRepository,
    )

    sut = new DeleteOrderUseCase(inMemoryOrderRepository)
  })

  it('should be able to delete an order', async () => {
    const order = makeOrder()

    inMemoryOrderRepository.create(order)

    await sut.execute({ orderId: order.id.toString() })

    expect(inMemoryOrderRepository.items).toHaveLength(0)
  })
})

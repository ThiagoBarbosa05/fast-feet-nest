import { InMemoryOrderRepository } from 'test/repositories/in-memory-order'
import { MarkOrderAsPickupUseCase } from './mark-order-as-pickup'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentsRepository

let sut: MarkOrderAsPickupUseCase

describe('Mark Order as Pickup', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentsRepository()

    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
      inMemoryOrderAttachmentRepository,
    )
    sut = new MarkOrderAsPickupUseCase(inMemoryOrderRepository)
  })

  it('should be possible for the order to pick up the order', async () => {
    const order = makeOrder()

    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      orderId: order.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0]).toMatchObject({
      deliveryStatus: 'collected',
    })
  })
})

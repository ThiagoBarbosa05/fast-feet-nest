import { InMemoryOrderRepository } from 'test/repositories/in-memory-order'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { GetOrderByIdUseCase } from './get-order-by-id'
import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeOrder } from 'test/factories/make-order'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentsRepository
let sut: GetOrderByIdUseCase

describe('Get order by id', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentsRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
      inMemoryOrderAttachmentRepository,
    )
    sut = new GetOrderByIdUseCase(inMemoryOrderRepository)
  })

  it('should be able to get an order by id', async () => {
    const recipient = makeRecipient()
    const order = makeOrder({ recipientId: recipient.id })

    await inMemoryOrderRepository.create(order)
    await inMemoryRecipientRepository.create(recipient)

    const result = await sut.execute({ orderId: order.id.toString() })

    expect(result.isRight()).toBeTruthy()
    expect(result.value).toMatchObject({
      order: {
        deliveryStatus: expect.any(String),
      },
    })
  })
})

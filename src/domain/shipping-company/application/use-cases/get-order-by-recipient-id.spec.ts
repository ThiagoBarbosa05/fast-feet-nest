import { InMemoryOrderRepository } from 'test/repositories/in-memory-order'
import { GetOrderByRecipientIdUseCase } from './get-order-by-recipient-id'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderAttachmentRepository: InMemoryOrderAttachmentsRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: GetOrderByRecipientIdUseCase

describe('Fetch orders by recipient id', () => {
  beforeEach(() => {
    inMemoryOrderAttachmentRepository = new InMemoryOrderAttachmentsRepository()
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
      inMemoryOrderAttachmentRepository,
    )
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new GetOrderByRecipientIdUseCase(inMemoryOrderRepository)
  })

  it('should be able to get an order by recipient id', async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientRepository.create(recipient)

    const orderCreated = makeOrder({
      recipientId: recipient.id,
    })
    await inMemoryOrderRepository.create(orderCreated)

    const result = await sut.execute({
      recipientId: recipient.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      order: {
        id: orderCreated.id,
        deliveryStatus: 'waiting',
      },
    })
  })

  it('It should not be possible to pick up an order from other recipient', async () => {
    const recipient = makeRecipient()

    await inMemoryRecipientRepository.create(recipient)

    const orderCreated = makeOrder({
      recipientId: recipient.id,
    })
    await inMemoryOrderRepository.create(orderCreated)

    const wrongRecipientId = 'wrongId'

    const result = await sut.execute({
      recipientId: wrongRecipientId,
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})

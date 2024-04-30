import { InMemoryOrderRepository } from 'test/repositories/in-memory-order'
import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attachments'
import { EditOrderUseCase } from './edit-order'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { makeOrder } from 'test/factories/make-order'
import { makeOrderAttachment } from 'test/factories/make-order-attachment'
import { UniqueEntityID } from '@/core/entities/uniques-entity-id'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository

let sut: EditOrderUseCase

describe('Edit order', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository()

    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
      inMemoryOrderAttachmentsRepository,
    )

    sut = new EditOrderUseCase(
      inMemoryOrderRepository,
      inMemoryOrderAttachmentsRepository,
    )
  })

  it('should be able to edit an order', async () => {
    const newOrder = makeOrder()

    await inMemoryOrderRepository.create(newOrder)

    inMemoryOrderAttachmentsRepository.items.push(
      makeOrderAttachment({
        orderId: newOrder.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeOrderAttachment({
        orderId: newOrder.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      attachmentsIds: ['1', '3'],
      deliveryStatus: 'delivered',
      orderId: newOrder.id.toString(),
    })

    expect(inMemoryOrderRepository.items[0]).toMatchObject({
      deliveryStatus: 'delivered',
    })

    expect(
      inMemoryOrderRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)

    expect(inMemoryOrderRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })
})

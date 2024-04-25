import { InMemoryOrderRepository } from 'test/repositories/in-memory-order'
import { MarkOrderAsDeliveredUseCase } from './mark-order-as-delivered'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { NotAllowedError } from './errors/not-allowed-error'
import { InMemoryOrderAttachmentsRepository } from 'test/repositories/in-memory-order-attchments'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository

let inMemoryOrderAttachmentsRepository: InMemoryOrderAttachmentsRepository
let sut: MarkOrderAsDeliveredUseCase

describe('Mark Order as Delivered', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderAttachmentsRepository =
      new InMemoryOrderAttachmentsRepository()

    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
      inMemoryOrderAttachmentsRepository,
    )
    sut = new MarkOrderAsDeliveredUseCase(inMemoryOrderRepository)
  })

  it('should be possible to mark the order as delivered.', async () => {
    const order = makeOrder({
      deliverymanId: new UniqueEntityID('deliveryman-1'),
    })

    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      orderId: order.id.toString(),
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0]).toMatchObject({
      deliveryStatus: 'delivered',
    })
    expect(
      inMemoryOrderRepository.items[0].attachments.currentItems,
    ).toHaveLength(2)
    expect(inMemoryOrderRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
    ])
  })

  it('should not be possible to mark the order as delivered by another deliveryman.', async () => {
    const order = makeOrder({
      deliverymanId: new UniqueEntityID('deliveryman-2'),
    })

    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      orderId: order.id.toString(),
      attachmentsIds: ['1', '2'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be possible to mark the order as delivered without an attachment', async () => {
    const order = makeOrder({
      deliverymanId: new UniqueEntityID('deliveryman-1'),
    })

    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      orderId: order.id.toString(),
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should persist attachments when the deliveryman delivers the order', async () => {
    const order = makeOrder({
      deliverymanId: new UniqueEntityID('deliveryman-1'),
    })

    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      orderId: order.id.toString(),
      attachmentsIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryOrderAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
      ]),
    )
  })
})

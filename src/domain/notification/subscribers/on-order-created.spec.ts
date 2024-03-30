import { InMemoryOrderRepository } from 'test/repositories/in-memory-order'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { OnOrderCreated } from './on-order-created'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../application/use-cases/send-notification'
import { makeRecipient } from 'test/factories/make-recipient'
import { waitFor } from 'test/utils/wait-for'
import { MockInstance } from 'vitest'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryNotificationRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase
let inMemoryRecipientRepository: InMemoryRecipientRepository

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On order created', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()

    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    )

    inMemoryNotificationRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')
    new OnOrderCreated(inMemoryRecipientRepository, sendNotificationUseCase)
  })

  it('should send a notification when an order is created', async () => {
    const recipient = makeRecipient()
    const order = makeOrder({ recipientId: recipient.id })

    await inMemoryRecipientRepository.create(recipient)

    await inMemoryOrderRepository.create(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})

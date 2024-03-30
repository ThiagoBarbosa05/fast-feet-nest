import { InMemoryOrderRepository } from 'test/repositories/in-memory-order'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { OnUpdateDeliveryStatus } from './on-update-delivery-status'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '../application/use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notification'
import { makeOrder } from 'test/factories/make-order'
import { MockInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let inMemoryRecipientRepository: InMemoryRecipientRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On update delivery status', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()

    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    )

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnUpdateDeliveryStatus(
      inMemoryRecipientRepository,
      sendNotificationUseCase,
    )
  })

  it('should send a notification when the delivery status changes', async () => {
    const recipient = makeRecipient()

    const order = makeOrder({ recipientId: recipient.id })

    await inMemoryRecipientRepository.create(recipient)
    await inMemoryOrderRepository.create(order)

    order.deliveryStatus = 'delivered'

    await inMemoryOrderRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})

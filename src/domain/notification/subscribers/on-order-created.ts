import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
// import { OrderRepository } from '@/domain/shipping-company/application/repositories/order'
import { OrderCreatedEvent } from '@/domain/shipping-company/enterprise/events/order-created-event'
import { SendNotificationUseCase } from '../application/use-cases/send-notification'
import { RecipientRepository } from '@/domain/shipping-company/application/repositories/recipient'

export class OnOrderCreated implements EventHandler {
  constructor(
    // private orderRepository: OrderRepository,
    private recipientRepository: RecipientRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscription()
  }

  setupSubscription(): void {
    DomainEvents.register(
      this.sendNewOrderNotification.bind(this),
      OrderCreatedEvent.name,
    )
  }

  private async sendNewOrderNotification({ order }: OrderCreatedEvent) {
    const recipient = await this.recipientRepository.findById(
      order.recipientId.toString(),
    )

    if (recipient) {
      await this.sendNotification.execute({
        recipientId: recipient.orderId.toString(),
        title: 'Your order is with the courier waiting to be delivered.',
      })
    }
  }
}

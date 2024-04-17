import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderCreatedEvent } from '@/domain/shipping-company/enterprise/events/order-created-event'
import { SendNotificationUseCase } from '../application/use-cases/send-notification'
import { RecipientRepository } from '@/domain/shipping-company/application/repositories/recipient'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnOrderCreated implements EventHandler {
  constructor(
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
        recipientId: recipient.id.toString(),
        title: 'Order created',
        content: 'Your order is with the courier waiting to be delivered.',
      })
    }
  }
}

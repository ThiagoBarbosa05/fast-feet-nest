import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { RecipientRepository } from '@/domain/shipping-company/application/repositories/recipient'
import { UpdateDeliveryStatusEvent } from '@/domain/shipping-company/enterprise/events/update-delivery-status-event'
import { SendNotificationUseCase } from '../application/use-cases/send-notification'

export class OnUpdateDeliveryStatus implements EventHandler {
  constructor(
    private recipientRepository: RecipientRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscription()
  }

  setupSubscription(): void {
    DomainEvents.register(
      this.sendDeliveryStatusNotification.bind(this),
      UpdateDeliveryStatusEvent.name,
    )
  }

  private async sendDeliveryStatusNotification({
    order,
  }: UpdateDeliveryStatusEvent) {
    const recipient = await this.recipientRepository.findById(
      order.recipientId.toString(),
    )

    if (recipient) {
      await this.sendNotification.execute({
        recipientId: recipient.id.toString(),
        title: 'Delivery status changed',
        content: `Your delivery status has changed to ${order.deliveryStatus}`,
      })
    }
  }
}

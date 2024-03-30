import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { Order } from '../entities/orders'

export class UpdateDeliveryStatusEvent implements DomainEvent {
  public ocurredAt: Date
  public order: Order

  constructor(order: Order) {
    this.order = order
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.order.id
  }
}

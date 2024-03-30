import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/uniques-entity-id'

export interface OrderAttachmentsProps {
  orderId: UniqueEntityID
  attachmentId: UniqueEntityID
}

export class OrderAttachments extends Entity<OrderAttachmentsProps> {
  get orderId() {
    return this.props.orderId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: OrderAttachmentsProps, id?: UniqueEntityID) {
    const orderAttachments = new OrderAttachments(props, id)

    return orderAttachments
  }
}

import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import {
  OrderAttachments,
  OrderAttachmentsProps,
} from '@/domain/shipping-company/enterprise/entities/order-attachments'

export function makeOrderAttachment(
  override: Partial<OrderAttachmentsProps> = {},
  id?: UniqueEntityID,
) {
  const orderAttachments = OrderAttachments.create(
    {
      attachmentId: new UniqueEntityID(),
      orderId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return orderAttachments
}

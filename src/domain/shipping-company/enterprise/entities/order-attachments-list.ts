import { WatchedList } from '@/core/entities/watched-list'
import { OrderAttachments } from './order-attachments'

export class OrderAttachmentsList extends WatchedList<OrderAttachments> {
  compareItems(a: OrderAttachments, b: OrderAttachments): boolean {
    return a.attachmentId.equals(b.attachmentId)
  }
}

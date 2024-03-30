import { OrderAttachments } from '../../enterprise/entities/order-attachments'

export interface OrderAttachmentsRepository {
  findManyByOrderId(orderId: string): Promise<OrderAttachments[]>
}

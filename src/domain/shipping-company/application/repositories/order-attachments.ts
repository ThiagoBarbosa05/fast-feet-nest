import { OrderAttachments } from '../../enterprise/entities/order-attachments'

export abstract class OrderAttachmentsRepository {
  abstract createMany(attachments: OrderAttachments[]): Promise<void>
  abstract deleteMany(attachments: OrderAttachments[]): Promise<void>
  abstract findManyByOrderId(orderId: string): Promise<OrderAttachments[]>
}

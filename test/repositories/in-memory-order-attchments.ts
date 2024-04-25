import { OrderAttachmentsRepository } from '@/domain/shipping-company/application/repositories/order-attachments'
import { OrderAttachments } from '@/domain/shipping-company/enterprise/entities/order-attachments'

export class InMemoryOrderAttachmentsRepository
  implements OrderAttachmentsRepository
{
  public items: OrderAttachments[] = []

  async findManyByOrderId(orderId: string) {
    const orderAttachments = this.items.filter(
      (item) => item.orderId.toString() === orderId,
    )

    return orderAttachments
  }

  async createMany(attachments: OrderAttachments[]): Promise<void> {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: OrderAttachments[]): Promise<void> {
    const orderAttachments = this.items.filter((item) => {
      return !attachments.some((attachment) => attachment.equals(item))
    })

    this.items = orderAttachments
  }
}

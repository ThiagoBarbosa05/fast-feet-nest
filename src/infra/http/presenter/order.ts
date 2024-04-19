import { Order } from '@/domain/shipping-company/enterprise/entities/orders'

export class OrderPresenter {
  static toHTTP(order: Order) {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      deliverymanId: order.deliverymanId.toString(),
      deliveryStatus: order.deliveryStatus,
      collectedAt: order.collectedAt,
      deliveredAt: order.deliveredAt,
      returnedAt: order.returnedAt,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }
}

import { OrderDetails } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/order-details'

export class OrderDetailsPresenter {
  static toHTTP(orderDetails: OrderDetails) {
    return {
      orderId: orderDetails.orderId.toString(),
      recipientId: orderDetails.recipientId.toString(),
      recipientName: orderDetails.recipientName,
      deliveryStatus: orderDetails.deliveryStatus,
      address: orderDetails.address,
      createdAt: orderDetails.createdAt,
      updatedAt: orderDetails.updatedAt,
    }
  }
}

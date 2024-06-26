import {
  FindManyNearDeliverymanParams,
  ListManyByDeliverymanIdParams,
  OrderRepository,
} from '@/domain/shipping-company/application/repositories/order'
import { Order } from '@/domain/shipping-company/enterprise/entities/orders'
import { InMemoryRecipientRepository } from './in-memory-recipient'
import { AddressService } from '@/domain/shipping-company/application/services/address-service'
import { DomainEvents } from '@/core/events/domain-events'
import { OrderAttachmentsRepository } from '@/domain/shipping-company/application/repositories/order-attachments'
import { OrderDetails } from '@/domain/shipping-company/enterprise/entities/value-objects.ts/order-details'

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = []

  constructor(
    private recipientRepository: InMemoryRecipientRepository,
    private orderAttachmentsRepository: OrderAttachmentsRepository,
  ) {}

  async create(order: Order) {
    this.items.push(order)

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async listManyByDeliverymanId({
    deliverymanId,
    page,
  }: ListManyByDeliverymanIdParams) {
    const orders = this.items
      .filter((item) => item.deliverymanId.toString() === deliverymanId)
      .slice((page - 1) * 20, page * 20)

    if (!orders) return null

    return orders
  }

  async getOrderByRecipientId(recipientId: string) {
    const order = this.items.find(
      (item) => item.recipientId.toString() === recipientId,
    )

    if (!order) {
      return null
    }

    return order
  }

  async findById(orderId: string) {
    const order = this.items.find((item) => item.id.toString() === orderId)

    if (!order) return null

    return order
  }

  async findOrderDetailsById(orderId: string) {
    const order = this.items.find((item) => item.id.toString() === orderId)

    if (!order) return null

    const recipientOrder = this.recipientRepository.items.find(
      (item) => item.id.toString() === order.recipientId.toString(),
    )

    if (!recipientOrder) return null

    return OrderDetails.create({
      orderId: order.id,
      recipientId: recipientOrder.id,
      deliveryStatus: order.deliveryStatus,
      recipientName: recipientOrder.name,
      address: recipientOrder.address,
      createdAt: order.createdAt,
    })
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === order.id.toString(),
    )

    this.items[itemIndex] = order

    if (order.attachments.currentItems.length > 0) {
      await this.orderAttachmentsRepository.createMany(
        order.attachments.getItems(),
      )
      await this.orderAttachmentsRepository.deleteMany(
        order.attachments.getRemovedItems(),
      )
    }

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async findManyNearDeliveryman(params: FindManyNearDeliverymanParams) {
    const recipientWithAddressNearby = this.recipientRepository.items.filter(
      (item) => {
        const distance = new AddressService().getDistanceBetweenCoordinates(
          {
            latitude: params.latitude,
            longitude: params.longitude,
          },
          {
            latitude: item.address.latitude,
            longitude: item.address.longitude,
          },
        )

        return distance < 20 // less 20 km distance
      },
    )

    const orderIds = recipientWithAddressNearby.map((recipient) =>
      recipient.id.toString(),
    )

    return this.items.filter((item) =>
      orderIds.includes(item.recipientId.toString()),
    )
  }

  async delete(order: Order) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toValue() === order.id.toValue(),
    )

    this.items.splice(itemIndex, 1)
  }
}

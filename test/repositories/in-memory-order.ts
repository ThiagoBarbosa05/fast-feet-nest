import {
  FindManyNearDeliverymanParams,
  ListManyByDeliverymanIdParams,
  ListManyByRecipientIdParams,
  OrderRepository,
} from '@/domain/shipping-company/application/repositories/order'
import { Order } from '@/domain/shipping-company/enterprise/entities/orders'
import { InMemoryRecipientRepository } from './in-memory-recipient'
import { AddressService } from '@/domain/shipping-company/application/services/address-service'
import { DomainEvents } from '@/core/events/domain-events'

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = []

  constructor(private recipientRepository: InMemoryRecipientRepository) {}

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

  async listManyByRecipientId({
    recipientId,
    page,
  }: ListManyByRecipientIdParams) {
    const orders = this.items
      .filter((item) => item.recipientId.toString() === recipientId)
      .slice((page - 1) * 20, page * 20)

    if (!orders) return null

    return orders
  }

  async findById(orderId: string) {
    const order = this.items.find((item) => item.id.toString() === orderId)

    if (!order) return null

    return order
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === order.id.toString(),
    )

    this.items[itemIndex] = order

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

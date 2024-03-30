import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import {
  Order,
  OrderProps,
} from '@/domain/shipping-company/enterprise/entities/orders'

export function makeOrder(
  override: Partial<OrderProps> = {},
  id?: UniqueEntityID,
) {
  const order = Order.create(
    {
      recipientId: new UniqueEntityID(),
      deliveryStatus: 'waiting',
      ...override,
    },
    id,
  )

  return order
}

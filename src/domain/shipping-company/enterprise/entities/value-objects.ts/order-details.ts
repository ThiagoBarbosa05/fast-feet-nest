import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { DeliveryStatus } from '../orders'
import { Address } from './address'
import { ValueObject } from '@/core/entities/value-objects'

export interface OrderDetailsProps {
  orderId: UniqueEntityID
  recipientId: UniqueEntityID
  recipientName: string
  deliveryStatus: DeliveryStatus
  address: Address
  createdAt: Date
  updatedAt?: Date | null
}

export class OrderDetails extends ValueObject<OrderDetailsProps> {
  get orderId() {
    return this.props.orderId
  }

  get recipientId() {
    return this.props.recipientId
  }

  get recipientName() {
    return this.props.recipientName
  }

  get deliveryStatus() {
    return this.props.deliveryStatus
  }

  get address() {
    return this.props.address
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: OrderDetailsProps) {
    return new OrderDetails(props)
  }
}

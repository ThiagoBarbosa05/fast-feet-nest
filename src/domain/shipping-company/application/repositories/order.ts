import { PaginationParams } from '@/core/repositories/pagination-params'
import { Order } from '../../enterprise/entities/orders'

export interface ListManyByDeliverymanIdParams extends PaginationParams {
  deliverymanId: string
}

export interface FindManyNearDeliverymanParams {
  latitude: number
  longitude: number
}

export abstract class OrderRepository {
  abstract create(order: Order): Promise<void>
  abstract listManyByDeliverymanId({
    deliverymanId,
    page,
  }: ListManyByDeliverymanIdParams): Promise<Order[] | null>

  abstract getOrderByRecipientId(recipientId: string): Promise<Order | null>

  abstract findById(orderId: string): Promise<Order | null>
  abstract save(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
  abstract findManyNearDeliveryman(
    params: FindManyNearDeliverymanParams,
  ): Promise<Order[] | null>
}

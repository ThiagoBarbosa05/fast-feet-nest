import { PaginationParams } from '@/core/repositories/pagination-params'
import { DeliverymanRepository } from '@/domain/shipping-company/application/repositories/deliveryman'
import { Deliveryman } from '@/domain/shipping-company/enterprise/entities/deliveryman'

export class InMemoryDeliverymanRepository implements DeliverymanRepository {
  public items: Deliveryman[] = []

  async create(deliveryman: Deliveryman) {
    this.items.push(deliveryman)
  }

  async findByDocument(document: string) {
    const deliveryman = this.items.find(
      (dl) => dl.document.toString() === document,
    )

    if (!deliveryman) return null

    return deliveryman
  }

  async findById(deliverymanId: string) {
    const deliveryman = this.items.find(
      (dl) => dl.id.toString() === deliverymanId,
    )

    if (!deliveryman) return null

    return deliveryman
  }

  async findMany({ page }: PaginationParams) {
    const deliveryman = this.items.slice((page - 1) * 20, page * 20)
    return deliveryman
  }

  async save(deliveryman: Deliveryman) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === deliveryman.id.toString(),
    )

    this.items[itemIndex] = deliveryman
  }

  async delete(deliveryman: Deliveryman) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toValue() === deliveryman.id.toValue(),
    )

    this.items.splice(itemIndex, 1)
  }
}

import { Deliveryman } from '@/domain/shipping-company/enterprise/entities/deliveryman'

export class DeliverymanPresenter {
  static toHTTP(deliveryman: Deliveryman) {
    return {
      id: deliveryman.id.toString(),
      name: deliveryman.name,
      document: deliveryman.document.toString(),
      createdAt: deliveryman.createdAt,
      updatedAt: deliveryman.updatedAt,
    }
  }
}

import { Either, left, right } from '@/core/either'
import { DeliveryStatus, Order } from '../../enterprise/entities/orders'
import { OrderRepository } from '../repositories/order'
import { OrderAttachmentsRepository } from '../repositories/order-attachments'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { OrderAttachments } from '../../enterprise/entities/order-attachments'
import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { OrderAttachmentsList } from '../../enterprise/entities/order-attachments-list'

export interface EditOrderUseCaseRequest {
  deliveryStatus: DeliveryStatus
  orderId: string
  attachmentsIds: string[]
}

type EditOrderUseCaseResponse = Either<ResourceNotFoundError, { order: Order }>

export class EditOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private orderAttachmentsRepository: OrderAttachmentsRepository,
  ) {}

  async execute({
    attachmentsIds,
    deliveryStatus,
    orderId,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const currentOrderAttachments =
      await this.orderAttachmentsRepository.findManyByOrderId(orderId)

    const orderAttachmentsList = new OrderAttachmentsList(
      currentOrderAttachments,
    )

    const orderAttachments = attachmentsIds.map((attachmentId) => {
      return OrderAttachments.create({
        attachmentId: new UniqueEntityID(attachmentId),
        orderId: order.id,
      })
    })

    orderAttachmentsList.update(orderAttachments)

    order.deliveryStatus = deliveryStatus
    order.attachments = orderAttachmentsList

    await this.orderRepository.save(order)

    return right({
      order,
    })
  }
}

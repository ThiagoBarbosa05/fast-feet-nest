import { Either, left, right } from '@/core/either'
import { OrderRepository } from '../repositories/order'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'
import { OrderAttachments } from '../../enterprise/entities/order-attachments'
import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { OrderAttachmentsList } from '../../enterprise/entities/order-attachments-list'

export interface MarkOrderAsDeliveredUseCaseRequest {
  deliverymanId: string
  orderId: string
  attachmentsIds: string[]
}

type MarkOrderAsDeliveredUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  object
>

export class MarkOrderAsDeliveredUseCase {
  constructor(private ordersRepository: OrderRepository) {}

  async execute({
    deliverymanId,
    orderId,
    attachmentsIds,
  }: MarkOrderAsDeliveredUseCaseRequest): Promise<MarkOrderAsDeliveredUseCaseResponse> {
    const orderDelivered = await this.ordersRepository.findById(orderId)

    if (!orderDelivered) {
      return left(new ResourceNotFoundError())
    }

    if (deliverymanId !== orderDelivered.deliverymanId.toString()) {
      return left(new NotAllowedError())
    }

    if (!attachmentsIds) {
      return left(new NotAllowedError())
    }

    if (attachmentsIds.length === 0) {
      return left(new NotAllowedError())
    }

    const ordersAttachments = attachmentsIds.map((attachmentId) => {
      return OrderAttachments.create({
        attachmentId: new UniqueEntityID(attachmentId),
        orderId: orderDelivered.id,
      })
    })

    orderDelivered.attachments = new OrderAttachmentsList(ordersAttachments)

    orderDelivered.deliveryStatus = 'delivered'

    await this.ordersRepository.save(orderDelivered)

    return right({})
  }
}

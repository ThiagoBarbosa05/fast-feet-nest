import { UseCaseError } from '@/core/errors/use-case-error'

export class DeliverymanAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Deliveryman already exists.')
  }
}

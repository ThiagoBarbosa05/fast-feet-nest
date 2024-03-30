import { UseCaseError } from '@/core/errors/use-case-error'

export class AdministratorAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor() {
    super('Administrator already exists.')
  }
}

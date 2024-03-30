import { UseCaseError } from '@/core/errors/use-case-error'

export class InvalidDocumentError extends Error implements UseCaseError {
  constructor() {
    super('Invalid Document.')
  }
}

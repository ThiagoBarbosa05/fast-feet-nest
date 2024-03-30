import { UniqueEntityID } from '../entities/uniques-entity-id'

export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueEntityID
}

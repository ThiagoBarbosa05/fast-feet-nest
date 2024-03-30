import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { Address } from './value-objects.ts/address'
import { Document } from './value-objects.ts/document'
import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'

export interface RecipientProps {
  orderId: UniqueEntityID
  name: string
  document: Document
  address: Address
  createdAt: Date
  updatedAt?: Date | null
}

export class Recipient extends Entity<RecipientProps> {
  get orderId() {
    return this.props.orderId
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get document() {
    return this.props.document
  }

  set document(document: Document) {
    this.props.document = document
    this.touch()
  }

  get address() {
    return this.props.address
  }

  set address(address: Address) {
    this.props.address = address
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<RecipientProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const recipient = new Recipient({ ...props, createdAt: new Date() }, id)

    return recipient
  }
}

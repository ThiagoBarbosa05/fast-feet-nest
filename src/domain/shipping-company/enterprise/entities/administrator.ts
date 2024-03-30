import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { Optional } from '@/core/types/optional'
import { Document } from './value-objects.ts/document'

export interface AdministratorProps {
  name: string
  document: Document
  password: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Administrator extends Entity<AdministratorProps> {
  get name() {
    return this.props.name
  }

  get document() {
    return this.props.document
  }

  get password() {
    return this.props.password
  }

  set password(value: string) {
    this.props.password = value
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
    props: Optional<AdministratorProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const administrator = new Administrator(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return administrator
  }
}

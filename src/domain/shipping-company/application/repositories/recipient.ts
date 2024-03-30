import { Recipient } from '../../enterprise/entities/recipient'

export abstract class RecipientRepository {
  abstract create(recipient: Recipient): Promise<void>
  abstract findById(recipientId: string): Promise<Recipient | null>
  abstract delete(recipient: Recipient): Promise<void>
  abstract save(recipient: Recipient): Promise<void>
}

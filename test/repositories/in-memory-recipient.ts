import { RecipientRepository } from '@/domain/shipping-company/application/repositories/recipient'
import { Recipient } from '@/domain/shipping-company/enterprise/entities/recipient'

export class InMemoryRecipientRepository implements RecipientRepository {
  public items: Recipient[] = []

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient)
  }

  async findById(recipientId: string) {
    const recipient = await this.items.find(
      (item) => item.id.toString() === recipientId,
    )

    if (!recipient) {
      return null
    }

    return recipient
  }

  async save(recipient: Recipient) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === recipient.id.toString(),
    )

    this.items[itemIndex] = recipient
  }

  async delete(recipient: Recipient) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toValue() === recipient.id.toValue(),
    )

    this.items.splice(itemIndex, 1)
  }
}

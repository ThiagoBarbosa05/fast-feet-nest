import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { DeleteRecipientUseCase } from './delete-recipient'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: DeleteRecipientUseCase

describe('Delete a recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new DeleteRecipientUseCase(inMemoryRecipientRepository)
  })

  it('should be able to delete a recipient', async () => {
    const recipient = makeRecipient()

    inMemoryRecipientRepository.create(recipient)

    await sut.execute({ recipientId: recipient.id.toString() })

    expect(inMemoryRecipientRepository.items).toHaveLength(0)
  })
})

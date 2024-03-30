import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { EditRecipientUseCase } from './edit-recipient'
import { makeRecipient } from 'test/factories/make-recipient'
import { Address } from '../../enterprise/entities/value-objects.ts/address'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: EditRecipientUseCase

describe('Edit Recipient Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new EditRecipientUseCase(inMemoryRecipientRepository)
  })

  it('should be able to edit a recipient', async () => {
    const recipientCreated = makeRecipient()

    await inMemoryRecipientRepository.create(recipientCreated)

    const result = await sut.execute({
      name: 'Bob',
      address: new Address(
        'street example',
        'New York',
        'NY',
        '12354545675',
        2423452,
        2355235,
      ),
      document: '12345678909',
      recipientId: recipientCreated.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientRepository.items[0].name).toEqual('Bob')
  })
})

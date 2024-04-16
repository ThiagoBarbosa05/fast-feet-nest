import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { CreateRecipientUseCase } from './create-recipient'
import { Address } from '../../enterprise/entities/value-objects.ts/address'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: CreateRecipientUseCase

describe('Create Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new CreateRecipientUseCase(inMemoryRecipientRepository)
  })

  it('should be able to create a recipient.', async () => {
    const result = await sut.execute({
      address: new Address(
        'Rua x',
        'Rio de Janeiro',
        'Rio de Janeiro',
        '28951730',
        335345,
        3535356,
      ),
      document: '12345678909',
      name: 'John Doe',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRecipientRepository.items[0].name).toEqual('John Doe')
  })
})

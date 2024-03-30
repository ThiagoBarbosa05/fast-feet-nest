import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { GetRecipientByIdUseCase } from './get-recipient-by-id'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let sut: GetRecipientByIdUseCase

describe('Get Recipient by id', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    sut = new GetRecipientByIdUseCase(inMemoryRecipientRepository)
  })

  it('should be able to get a recipient by id', async () => {
    const recipientCreated = makeRecipient({ name: 'John Doe' })

    await inMemoryRecipientRepository.create(recipientCreated)

    const result = await sut.execute({
      recipientId: recipientCreated.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      recipient: {
        name: 'John Doe',
      },
    })
  })
})

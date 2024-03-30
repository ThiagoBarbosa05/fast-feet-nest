import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { generateRandomCPF } from 'test/utils/generate-random-cpf'
import { Document } from '../../enterprise/entities/value-objects.ts/document'
import { AuthenticateDeliverymanUseCase } from './authenticate-deliveryman'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter
let sut: AuthenticateDeliverymanUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()
    sut = new AuthenticateDeliverymanUseCase(
      inMemoryDeliverymanRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be authenticate a deliveryman', async () => {
    const deliveryman = makeDeliveryman({
      document: new Document(generateRandomCPF()),
      password: await fakeHasher.hash('364556'),
    })

    inMemoryDeliverymanRepository.items.push(deliveryman)

    const result = await sut.execute({
      document: deliveryman.document.toValue(),
      password: '364556',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('must not be possible for the deliveryman to authenticate with invalid credentials.', async () => {
    const deliveryman = makeDeliveryman({
      document: new Document(generateRandomCPF()),
      password: await fakeHasher.hash('364556'),
    })

    inMemoryDeliverymanRepository.items.push(deliveryman)

    const result = await sut.execute({
      document: deliveryman.document.toValue(),
      password: 'wrongPassword',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})

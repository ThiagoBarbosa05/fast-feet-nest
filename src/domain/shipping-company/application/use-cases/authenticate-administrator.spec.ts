import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryAdministratorRepository } from 'test/repositories/in-memory-administrator'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeAdministrator } from 'test/factories/make-administrator'
import { generateRandomCPF } from 'test/utils/generate-random-cpf'
import { Document } from '../../enterprise/entities/value-objects.ts/document'
import { AuthenticateAdministratorUseCase } from './authenticate-administrator'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let inMemoryAdministratorRepository: InMemoryAdministratorRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter
let sut: AuthenticateAdministratorUseCase

describe('Authenticate use case', () => {
  beforeEach(() => {
    inMemoryAdministratorRepository = new InMemoryAdministratorRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()
    sut = new AuthenticateAdministratorUseCase(
      inMemoryAdministratorRepository,
      fakeHasher,
      encrypter,
    )
  })

  it('should be authenticate a administrator', async () => {
    const administrator = makeAdministrator({
      document: new Document(generateRandomCPF()),
      password: await fakeHasher.hash('364556'),
    })

    inMemoryAdministratorRepository.items.push(administrator)

    const result = await sut.execute({
      document: administrator.document.toValue(),
      password: '364556',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('must not be possible for the administrator to authenticate with invalid credentials.', async () => {
    const administrator = makeAdministrator({
      document: new Document(generateRandomCPF()),
      password: await fakeHasher.hash('364556'),
    })

    inMemoryAdministratorRepository.items.push(administrator)

    const result = await sut.execute({
      document: administrator.document.toValue(),
      password: 'wrongPassword',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})

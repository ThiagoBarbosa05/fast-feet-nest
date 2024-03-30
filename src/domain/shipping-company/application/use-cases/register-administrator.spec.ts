import { FakeHasher } from 'test/cryptography/fake-hasher'
import { RegisterAdministratorUseCase } from './register-administrator'
import { InMemoryAdministratorRepository } from 'test/repositories/in-memory-administrator'
import { Document } from '../../enterprise/entities/value-objects.ts/document'
import { makeAdministrator } from 'test/factories/make-administrator'
import { AdministratorAlreadyExistsError } from './errors/administrator-already-exists-error'
import { InvalidDocumentError } from './errors/invalid-document-error'

let fakeHasher: FakeHasher
let inMemoryAdministratorRepository: InMemoryAdministratorRepository
let sut: RegisterAdministratorUseCase

describe('Register Administrator', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher()
    inMemoryAdministratorRepository = new InMemoryAdministratorRepository()
    sut = new RegisterAdministratorUseCase(
      fakeHasher,
      inMemoryAdministratorRepository,
    )
  })

  it('should be able to register an administrator', async () => {
    const result = await sut.execute({
      document: new Document('16409526750'),
      name: 'John Doe',
      password: 'example',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      administrator: inMemoryAdministratorRepository.items[0],
    })
  })

  it('should hash administrator password upon registration', async () => {
    const result = await sut.execute({
      document: new Document('16409526750'),
      name: 'John Doe',
      password: 'example',
    })

    const hashedPassword = await fakeHasher.hash('example')

    expect(result.isRight()).toBe(true)
    expect(inMemoryAdministratorRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })

  it('not should be able to register an administrator with invalid document.', async () => {
    const result = await sut.execute({
      document: new Document('1640952675034'),
      name: 'John Doe',
      password: 'example',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidDocumentError)
  })

  it('not should be able to register an administrator with the same document.', async () => {
    const admin = makeAdministrator({
      document: new Document('16409526750'),
    })

    inMemoryAdministratorRepository.items.push(admin)

    const result = await sut.execute({
      document: new Document('16409526750'),
      name: 'John Doe',
      password: 'example',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(AdministratorAlreadyExistsError)
  })
})

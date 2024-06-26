import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman'
import { EditDeliverymanUseCase } from './edit-deliveryman'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { Address } from '../../enterprise/entities/value-objects.ts/address'
import { UniqueEntityID } from '@/core/entities/uniques-entity-id'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let fakeHasher: FakeHasher
let sut: EditDeliverymanUseCase

describe('Edit deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    fakeHasher = new FakeHasher()
    sut = new EditDeliverymanUseCase(inMemoryDeliverymanRepository, fakeHasher)
  })

  it('should be to edit a deliveryman', async () => {
    const deliveryman = makeDeliveryman(
      {
        address: new Address(
          'street example',
          'New York',
          'NY',
          '12354545675',
          2345235,
          2352535,
        ),
        password: '364556',
      },
      new UniqueEntityID('deliveryman-1'),
    )
    await inMemoryDeliverymanRepository.create(deliveryman)

    await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      password: 'new-password',
      address: new Address(
        'street x',
        'London',
        'LD',
        '34345465456',
        2345235,
        2352535,
      ),
    })

    expect(inMemoryDeliverymanRepository.items[0].address.city).toEqual(
      'London',
    )
  })
})

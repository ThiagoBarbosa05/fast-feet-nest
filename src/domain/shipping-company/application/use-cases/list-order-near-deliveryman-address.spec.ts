import { makeOrder } from 'test/factories/make-order'
import { makeRecipient } from 'test/factories/make-recipient'
import { Address } from '../../enterprise/entities/value-objects.ts/address'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { ListOrderNearDeliverymanAddressUseCase } from './list-order-near-deliveryman-address'
import { UniqueEntityID } from '@/core/entities/uniques-entity-id'

let inMemoryRecipientRepository: InMemoryRecipientRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: ListOrderNearDeliverymanAddressUseCase

describe('List orders near the deliveryman', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository(
      inMemoryRecipientRepository,
    )

    sut = new ListOrderNearDeliverymanAddressUseCase(inMemoryOrderRepository)
  })

  it('should be able to list orders near the deliveryman', async () => {
    const addressNearby = new Address(
      'Av. José Bento Ribeiro Dantas',
      'Buzios',
      'RJ',
      '28950-000',
      -22.773281865476424,
      -41.91342668309329,
    )

    const addressFarAway = new Address(
      'Alfonso Pena',
      'Arraial',
      'RJ',
      '28930-000',
      -22.967091949002167,
      -42.026875242193924,
    )

    const recipientWithAddressNearby = makeRecipient({
      address: addressNearby,
      orderId: new UniqueEntityID('order-1'),
    })

    const recipientWithAddressFarAway = makeRecipient({
      address: addressFarAway,
      orderId: new UniqueEntityID('order-2'),
    })

    await inMemoryRecipientRepository.create(recipientWithAddressNearby)
    await inMemoryRecipientRepository.create(recipientWithAddressFarAway)

    const orderToList = makeOrder(
      {
        recipientId: new UniqueEntityID(
          recipientWithAddressNearby.id.toString(),
        ),
      },
      new UniqueEntityID('order-1'),
    )

    const orderNotToList = makeOrder(
      {
        recipientId: new UniqueEntityID(
          recipientWithAddressFarAway.id.toString(),
        ),
      },
      new UniqueEntityID('order-2'),
    )

    await inMemoryOrderRepository.create(orderToList)
    await inMemoryOrderRepository.create(orderNotToList)

    const result = await sut.execute({
      latitude: -22.773281865476424,
      longitude: -41.91342668309329,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      order: [
        expect.objectContaining({ recipientId: recipientWithAddressNearby.id }),
      ],
    })
  })
})

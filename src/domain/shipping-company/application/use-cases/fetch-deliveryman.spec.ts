import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman'
import { FetchDeliverymanUseCase } from './fetch-deliveryman'
import { makeDeliveryman } from 'test/factories/make-deliveryman'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let sut: FetchDeliverymanUseCase

describe('Fetch deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    sut = new FetchDeliverymanUseCase(inMemoryDeliverymanRepository)
  })

  it('should be able to fetch deliveryman', async () => {
    await inMemoryDeliverymanRepository.create(
      makeDeliveryman({ name: 'John Doe' }),
    )

    await inMemoryDeliverymanRepository.create(
      makeDeliveryman({ name: 'Uncle Bob' }),
    )

    await inMemoryDeliverymanRepository.create(
      makeDeliveryman({ name: 'Martin Freeman' }),
    )

    const result = await sut.execute({ page: 1 })

    expect(result.value?.deliveryman).toEqual([
      expect.objectContaining({ name: 'John Doe' }),
      expect.objectContaining({ name: 'Uncle Bob' }),
      expect.objectContaining({ name: 'Martin Freeman' }),
    ])
  })

  it('should be able to fetch paginated deliveryman', async () => {
    for (let i = 1; i <= 25; i++) {
      await inMemoryDeliverymanRepository.create(makeDeliveryman())
    }

    const result = await sut.execute({ page: 2 })

    expect(result.value?.deliveryman).toHaveLength(5)
  })
})

import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman'
import { DeleteDeliverymanUseCase } from './delete-deliveryman'
import { makeDeliveryman } from 'test/factories/make-deliveryman'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let sut: DeleteDeliverymanUseCase

describe('Delete a deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    sut = new DeleteDeliverymanUseCase(inMemoryDeliverymanRepository)
  })

  it('should be able to delete a deliveryman', async () => {
    const deliveryman = makeDeliveryman()

    inMemoryDeliverymanRepository.create(deliveryman)

    await sut.execute({ deliverymanId: deliveryman.id.toString() })

    expect(inMemoryDeliverymanRepository.items).toHaveLength(0)
  })
})

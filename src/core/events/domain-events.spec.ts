import { AggregateRoot } from '../entities/aggregate-root'
import { UniqueEntityID } from '../entities/uniques-entity-id'
import { DomainEvent } from './domain-event'
import { DomainEvents } from './domain-events'

class CustomAggregateCreated implements DomainEvent {
  public ocurredAt: Date
  // eslint-disable-next-line no-use-before-define
  private aggregate: CustomAggregate

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate
    this.ocurredAt = new Date()
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null)

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate))

    return aggregate
  }
}

describe('domain events', () => {
  it('should be able to dispatch and listen to events', async () => {
    const callbackSpy = vi.fn()

    // Registered subscriber (listening to the "response created" event)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name)

    // I'm creating a response but WITHOUT saving it to the bank
    const aggregate = CustomAggregate.create()

    // I am ensuring that the event was created but was NOT fired
    expect(aggregate.domainEvents).toHaveLength(1)

    // I'm creating a response but WITHOUT saving it to the bank
    DomainEvents.dispatchEventsForAggregate(aggregate.id)

    // The subscriber listens to the event and does what needs to be done with the data
    expect(callbackSpy).toHaveBeenCalled()

    expect(aggregate.domainEvents).toHaveLength(0)
  })
})

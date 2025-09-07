import { beforeEach, describe, expect, it } from 'vitest';
import { AggregateRoot } from '../../src/domain/shared/AggregateRoot';
import { DomainEvent } from '../../src/domain/shared/DomainEvent';
import { ValueObject } from '../../src/domain/shared/ValueObject';

// Test ID value object
class TestId extends ValueObject {
  constructor(private readonly value: string) {
    super();
  }

  toString(): string {
    return this.value;
  }

  protected getEqualityComponents(): unknown[] {
    return [this.value];
  }
}

// Test domain events
class TestEventCreated extends DomainEvent {
  constructor(
    public readonly aggregateId: TestId,
    public readonly data: string,
    occurredAt?: Date
  ) {
    super('TestEventCreated', occurredAt);
    this.freeze();
  }
}

class TestEventUpdated extends DomainEvent {
  constructor(
    public readonly aggregateId: TestId,
    public readonly oldValue: string,
    public readonly newValue: string,
    occurredAt?: Date
  ) {
    super('TestEventUpdated', occurredAt);
    this.freeze();
  }
}

// Test aggregate
class TestAggregate extends AggregateRoot<TestId> {
  private data: string;

  constructor(id: TestId, data: string) {
    super(id);
    this.data = data;
    this.raise(new TestEventCreated(id, data));
  }

  updateData(newData: string): void {
    const oldData = this.data;
    this.data = newData;
    this.raise(new TestEventUpdated(this.id, oldData, newData));
  }

  getData(): string {
    return this.data;
  }
}

describe('AggregateRoot', () => {
  let aggregate: TestAggregate;
  let testId: TestId;

  beforeEach(() => {
    testId = new TestId('test-123');
    aggregate = new TestAggregate(testId, 'initial data');
  });

  describe('domain event management', () => {
    it('should record domain events when raised', () => {
      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TestEventCreated);
      expect((events[0] as TestEventCreated).aggregateId.equals(testId)).toBe(true);
      expect((events[0] as TestEventCreated).data).toBe('initial data');
    });

    it('should accumulate multiple domain events', () => {
      aggregate.updateData('updated data');
      aggregate.updateData('final data');

      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(3); // Created + 2 Updates
      expect(events[0]).toBeInstanceOf(TestEventCreated);
      expect(events[1]).toBeInstanceOf(TestEventUpdated);
      expect(events[2]).toBeInstanceOf(TestEventUpdated);
    });

    it('should provide events in the order they were raised', () => {
      aggregate.updateData('first update');
      aggregate.updateData('second update');

      const events = aggregate.getUncommittedEvents();

      expect((events[1] as TestEventUpdated).newValue).toBe('first update');
      expect((events[2] as TestEventUpdated).newValue).toBe('second update');
    });

    it('should include event timestamps', () => {
      const beforeTime = new Date();
      aggregate.updateData('timed update');
      const afterTime = new Date();

      const events = aggregate.getUncommittedEvents();
      const updateEvent = events[1] as TestEventUpdated;

      expect(updateEvent.occurredAt).toBeInstanceOf(Date);
      expect(updateEvent.occurredAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
      expect(updateEvent.occurredAt.getTime()).toBeLessThanOrEqual(afterTime.getTime());
    });
  });

  describe('event commit functionality', () => {
    it('should clear events after marking as committed', () => {
      aggregate.updateData('some update');

      expect(aggregate.getUncommittedEvents()).toHaveLength(2);

      aggregate.markEventsAsCommitted();

      expect(aggregate.getUncommittedEvents()).toHaveLength(0);
    });

    it('should not affect new events raised after commit', () => {
      aggregate.markEventsAsCommitted();
      aggregate.updateData('post-commit update');

      const events = aggregate.getUncommittedEvents();

      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(TestEventUpdated);
    });
  });

  describe('entity inheritance', () => {
    it('should inherit entity behavior', () => {
      expect(aggregate.id.equals(testId)).toBe(true);
    });

    it('should maintain entity equality based on ID', () => {
      const sameId = new TestId('test-123');
      const otherAggregate = new TestAggregate(sameId, 'different data');

      expect(aggregate.equals(otherAggregate)).toBe(true);
    });
  });

  describe('business logic integration', () => {
    it('should combine business logic with event raising', () => {
      const initialData = aggregate.getData();
      aggregate.updateData('business update');

      expect(aggregate.getData()).toBe('business update');

      const events = aggregate.getUncommittedEvents();
      const updateEvent = events[1] as TestEventUpdated;

      expect(updateEvent.oldValue).toBe(initialData);
      expect(updateEvent.newValue).toBe('business update');
    });
  });

  describe('event immutability', () => {
    it('should return copy of events to prevent external modification', () => {
      aggregate.updateData('test');

      const events1 = aggregate.getUncommittedEvents();
      const events2 = aggregate.getUncommittedEvents();

      expect(events1).not.toBe(events2); // Different arrays
      expect(events1).toEqual(events2); // Same content

      // Modifying returned array shouldn't affect internal state
      events1.pop();
      expect(aggregate.getUncommittedEvents()).toHaveLength(2);
    });
  });
});

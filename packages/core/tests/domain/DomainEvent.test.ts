import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DomainEvent } from '../../src/domain/shared/DomainEvent';

// Test domain events
class UserRegisteredEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    occurredAt?: Date
  ) {
    super('UserRegistered', occurredAt);
    this.freeze();
  }
}

class OrderPlacedEvent extends DomainEvent {
  constructor(
    public readonly orderId: string,
    public readonly customerId: string,
    public readonly amount: number,
    occurredAt?: Date
  ) {
    super('OrderPlaced', occurredAt);
    this.freeze();
  }
}

describe('DomainEvent', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('event creation', () => {
    it('should create event with provided timestamp', () => {
      const customTime = new Date('2023-01-01T12:00:00Z');
      const event = new UserRegisteredEvent('user-123', 'test@example.com', customTime);

      expect(event.eventType).toBe('UserRegistered');
      expect(event.occurredAt).toBe(customTime);
      expect(event.userId).toBe('user-123');
      expect(event.email).toBe('test@example.com');
    });

    it('should create event with current timestamp when none provided', () => {
      const now = new Date('2023-06-15T14:30:00Z');
      vi.setSystemTime(now);

      const event = new UserRegisteredEvent('user-123', 'test@example.com');

      expect(event.eventType).toBe('UserRegistered');
      expect(event.occurredAt).toEqual(now);
    });

    it('should generate unique event ID', () => {
      const event1 = new UserRegisteredEvent('user-123', 'test1@example.com');
      const event2 = new UserRegisteredEvent('user-456', 'test2@example.com');

      expect(event1.eventId).toBeDefined();
      expect(event2.eventId).toBeDefined();
      expect(event1.eventId).not.toBe(event2.eventId);
      expect(typeof event1.eventId).toBe('string');
      expect(event1.eventId.length).toBeGreaterThan(0);
    });
  });

  describe('event properties', () => {
    it('should have immutable core properties', () => {
      const event = new UserRegisteredEvent('user-123', 'test@example.com');

      // These properties should be readonly
      expect(event.eventId).toBeDefined();
      expect(event.eventType).toBe('UserRegistered');
      expect(event.occurredAt).toBeInstanceOf(Date);

      // Domain-specific properties should also be accessible
      expect(event.userId).toBe('user-123');
      expect(event.email).toBe('test@example.com');
    });

    it('should support different event types with different data', () => {
      const userEvent = new UserRegisteredEvent('user-123', 'test@example.com');
      const orderEvent = new OrderPlacedEvent('order-456', 'customer-789', 99.99);

      expect(userEvent.eventType).toBe('UserRegistered');
      expect(orderEvent.eventType).toBe('OrderPlaced');

      expect(userEvent.userId).toBe('user-123');
      expect(orderEvent.orderId).toBe('order-456');
      expect(orderEvent.amount).toBe(99.99);
    });
  });

  describe('timestamp behavior', () => {
    it('should preserve millisecond precision in timestamps', () => {
      const preciseTime = new Date('2023-01-01T12:00:00.123Z');
      const event = new UserRegisteredEvent('user-123', 'test@example.com', preciseTime);

      expect(event.occurredAt.getTime()).toBe(preciseTime.getTime());
      expect(event.occurredAt.getMilliseconds()).toBe(123);
    });

    it('should handle timezone correctly', () => {
      const utcTime = new Date('2023-01-01T12:00:00.000Z');
      const event = new UserRegisteredEvent('user-123', 'test@example.com', utcTime);

      expect(event.occurredAt.toISOString()).toBe('2023-01-01T12:00:00.000Z');
    });
  });

  describe('event inheritance', () => {
    it('should allow subclasses to add domain-specific properties', () => {
      class ComplexEvent extends DomainEvent {
        constructor(
          public readonly aggregateId: string,
          public readonly payload: { data: any; metadata: Record<string, any> },
          public readonly correlationId?: string,
          occurredAt?: Date
        ) {
          super('ComplexEvent', occurredAt);
          this.freeze();
        }
      }

      const complexEvent = new ComplexEvent(
        'aggregate-123',
        {
          data: { field: 'value' },
          metadata: { source: 'api', version: '1.0' },
        },
        'correlation-456'
      );

      expect(complexEvent.eventType).toBe('ComplexEvent');
      expect(complexEvent.aggregateId).toBe('aggregate-123');
      expect(complexEvent.payload.data.field).toBe('value');
      expect(complexEvent.correlationId).toBe('correlation-456');
    });
  });

  describe('serialization considerations', () => {
    it('should contain serializable data', () => {
      const event = new OrderPlacedEvent('order-123', 'customer-456', 199.99);

      // Test that the event can be serialized to JSON
      const serialized = JSON.stringify(event);
      const deserialized = JSON.parse(serialized);

      expect(deserialized.eventType).toBe('OrderPlaced');
      expect(deserialized.orderId).toBe('order-123');
      expect(deserialized.amount).toBe(199.99);
      expect(typeof deserialized.occurredAt).toBe('string'); // Date becomes string in JSON
    });
  });

  describe('event identity', () => {
    it('should have consistent event ID format', () => {
      const event = new UserRegisteredEvent('user-123', 'test@example.com');

      // Event ID should be a non-empty string (implementation may vary)
      expect(typeof event.eventId).toBe('string');
      expect(event.eventId.length).toBeGreaterThan(0);
      expect(event.eventId).not.toContain(' '); // Should not contain spaces
    });
  });
});

import { randomUUID } from 'node:crypto';

/**
 * Base Domain Event Class
 *
 * Domain Events represent something that happened in the domain that domain
 * experts care about. They are immutable facts about things that have happened
 * and capture the intent and purpose behind a domain action.
 *
 * Key characteristics:
 * - Immutable after creation
 * - Represents something that happened in the past (use past tense names)
 * - Contains all data needed to understand what happened
 * - Has a unique identity and timestamp
 */
export abstract class DomainEvent {
  /**
   * Unique identifier for this event instance
   */
  public readonly eventId: string;

  /**
   * The type/name of the domain event
   */
  public readonly eventType: string;

  /**
   * When this event occurred
   */
  public readonly occurredAt: Date;

  protected constructor(eventType: string, occurredAt?: Date) {
    if (!eventType || eventType.trim().length === 0) {
      throw new Error('Event type cannot be empty');
    }

    this.eventId = randomUUID();
    this.eventType = eventType;
    this.occurredAt = occurredAt || new Date();
  }

  /**
   * Freezes the event to ensure immutability
   * Call this in subclass constructors after setting all properties
   */
  protected freeze(): void {
    Object.freeze(this);
  }

  /**
   * Returns a string representation of the event
   * Useful for debugging and logging
   */
  toString(): string {
    return `${this.eventType}[${this.eventId}] occurred at ${this.occurredAt.toISOString()}`;
  }

  /**
   * Returns a JSON representation of the event
   * Useful for serialization and storage
   */
  toJSON(): Record<string, unknown> {
    const result: Record<string, unknown> = {
      eventId: this.eventId,
      eventType: this.eventType,
      occurredAt: this.occurredAt.toISOString(),
    };

    // Include all enumerable properties from the concrete event
    const propertyNames = Object.getOwnPropertyNames(this);
    for (const prop of propertyNames) {
      if (prop !== 'eventId' && prop !== 'eventType' && prop !== 'occurredAt') {
        result[prop] = (this as any)[prop];
      }
    }

    return result;
  }

  /**
   * Creates a copy of this event with a new timestamp
   * Since events are immutable, this creates a new event instance
   * This method is useful for event replay scenarios
   */
  copyWithNewTimestamp(_newTimestamp: Date): DomainEvent {
    // This is a simplified implementation - in practice, you might want
    // to use a factory pattern or reflection to properly recreate the event
    throw new Error('copyWithNewTimestamp must be implemented by concrete event classes');
  }

  /**
   * Returns the age of this event in milliseconds
   */
  getAge(): number {
    return Date.now() - this.occurredAt.getTime();
  }

  /**
   * Returns true if this event occurred before the specified date
   */
  occurredBefore(date: Date): boolean {
    return this.occurredAt < date;
  }

  /**
   * Returns true if this event occurred after the specified date
   */
  occurredAfter(date: Date): boolean {
    return this.occurredAt > date;
  }

  /**
   * Returns true if this event occurred within the specified time window
   */
  occurredWithin(fromDate: Date, toDate: Date): boolean {
    return this.occurredAt >= fromDate && this.occurredAt <= toDate;
  }

  /**
   * Compares this event with another event based on occurrence time
   * Returns negative if this event occurred before other,
   * positive if after, zero if at the same time
   */
  compareByTime(other: DomainEvent): number {
    return this.occurredAt.getTime() - other.occurredAt.getTime();
  }
}

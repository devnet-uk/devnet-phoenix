import type { DomainEvent } from './DomainEvent';
import { Entity } from './Entity';
import type { ValueObject } from './ValueObject';

/**
 * Base Aggregate Root Class
 *
 * An Aggregate Root is an Entity that serves as the entry point to an aggregate.
 * It ensures consistency boundaries and manages domain events that represent
 * changes within the aggregate.
 *
 * Key characteristics:
 * - Controls access to the aggregate's internal entities and value objects
 * - Manages domain events that represent state changes
 * - Maintains consistency boundaries
 * - Only aggregate roots can be referenced from outside the aggregate
 */
export abstract class AggregateRoot<TId extends ValueObject> extends Entity<TId> {
  private _domainEvents: DomainEvent[] = [];

  protected constructor(id: TId) {
    super(id);
  }

  /**
   * Raises a domain event
   * This records that something significant has happened within the aggregate
   * Events are stored until they are committed/published
   */
  protected raise(event: DomainEvent): void {
    if (!event) {
      throw new Error('Cannot raise null or undefined domain event');
    }

    this._domainEvents.push(event);
  }

  /**
   * Gets all uncommitted domain events
   * Returns a copy to prevent external modification
   */
  getUncommittedEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  /**
   * Marks all domain events as committed
   * This should be called after events have been successfully published/stored
   * Clears the internal event list
   */
  markEventsAsCommitted(): void {
    this._domainEvents = [];
  }

  /**
   * Gets the number of uncommitted events
   * Useful for monitoring and diagnostics
   */
  getUncommittedEventCount(): number {
    return this._domainEvents.length;
  }

  /**
   * Returns true if there are uncommitted events
   */
  hasUncommittedEvents(): boolean {
    return this._domainEvents.length > 0;
  }

  /**
   * Gets uncommitted events of a specific type
   * Useful for filtering events or checking if specific events occurred
   */
  getUncommittedEventsOfType<T extends DomainEvent>(eventType: new (...args: any[]) => T): T[] {
    return this._domainEvents.filter((event) => event instanceof eventType) as T[];
  }

  /**
   * Returns the most recent uncommitted event
   * Returns undefined if no events exist
   */
  getLastUncommittedEvent(): DomainEvent | undefined {
    return this._domainEvents[this._domainEvents.length - 1];
  }

  /**
   * Returns the first uncommitted event
   * Returns undefined if no events exist
   */
  getFirstUncommittedEvent(): DomainEvent | undefined {
    return this._domainEvents[0];
  }

  /**
   * Replays events to reconstruct the aggregate state
   * This is useful for event sourcing scenarios where aggregates are
   * reconstructed from their event history
   */
  protected replayEvents(events: DomainEvent[]): void {
    for (const event of events) {
      this.applyEvent(event);
    }
    // After replaying, mark as no uncommitted changes
    this._domainEvents = [];
  }

  /**
   * Applies a single event to update the aggregate's state
   * Subclasses should override this to handle their specific events
   * This method should only update state, not raise new events
   */
  protected applyEvent(_event: DomainEvent): void {
    // Default implementation does nothing
    // Subclasses should override to handle their domain events
  }

  /**
   * Validates the aggregate's current state including all entities within it
   * Override to implement aggregate-specific validation rules
   */
  protected override validate(): boolean {
    return super.validate();
  }

  /**
   * Returns aggregate-specific information for debugging
   */
  override toString(): string {
    const baseString = super.toString();
    const eventCount = this.getUncommittedEventCount();
    return `${baseString} [${eventCount} uncommitted events]`;
  }

  /**
   * Creates a snapshot of the current aggregate state
   * This is useful for performance optimization in event sourcing
   * Subclasses should override to provide meaningful snapshots
   */
  createSnapshot(): Record<string, unknown> {
    return {
      aggregateId: this.id.toString(),
      aggregateType: this.constructor.name,
      lastEventId: this.getLastUncommittedEvent()?.eventId,
      eventCount: this.getUncommittedEventCount(),
      snapshotDate: new Date().toISOString(),
    };
  }
}

import type { ValueObject } from './ValueObject';

/**
 * Base Entity Class
 *
 * Entities are objects that have a distinct identity that runs through time
 * and different representations. Two entities are equal if their identities
 * are equal, regardless of their other attributes.
 *
 * Key characteristics:
 * - Has a unique identity (ID) that remains constant
 * - Mutable attributes (except ID)
 * - Equality based on identity, not attributes
 * - Can change over time while maintaining identity
 */
export abstract class Entity<TId extends ValueObject> {
  /**
   * The unique identifier for this entity
   * This ID is immutable and defines the entity's identity
   */
  public readonly id: TId;

  protected constructor(id: TId) {
    if (!id) {
      throw new Error('Entity ID cannot be null or undefined');
    }
    this.id = id;
  }

  /**
   * Determines equality between entities based on their IDs
   * Two entities are equal if they have the same type and the same ID
   */
  equals(other: Entity<TId>): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (this === other) {
      return true;
    }

    if (this.constructor !== other.constructor) {
      return false;
    }

    return this.id.equals(other.id);
  }

  /**
   * Returns a string representation of the entity
   * Useful for debugging and logging
   */
  toString(): string {
    return `${this.constructor.name}(${this.id.toString()})`;
  }

  /**
   * Returns a hash code for this entity based on its ID
   * Useful for collections and hash-based operations
   */
  hashCode(): string {
    return `${this.constructor.name}#${this.id.toString()}`;
  }

  /**
   * Validates the entity's current state
   * Subclasses can override this to implement domain-specific validation rules
   * Returns a Result indicating whether the entity is valid
   */
  protected validate(): boolean {
    return this.id !== null && this.id !== undefined;
  }

  /**
   * Checks if this entity is valid according to domain rules
   * Uses the validate() method internally
   */
  isValid(): boolean {
    try {
      return this.validate();
    } catch {
      return false;
    }
  }

  /**
   * Returns the type name of this entity
   * Useful for logging and debugging
   */
  getType(): string {
    return this.constructor.name;
  }
}

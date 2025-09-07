/**
 * Base Value Object Class
 *
 * Value Objects are immutable objects that represent a descriptive aspect
 * of a domain with no conceptual identity. Two value objects are considered
 * equal if all their attributes are equal.
 *
 * Key characteristics:
 * - Immutable after creation
 * - Equality based on attributes, not identity
 * - No side effects
 * - Can be safely passed around and shared
 */
export abstract class ValueObject {
  /**
   * Determines equality between value objects based on their components
   * Two value objects are equal if all their equality components are equal
   */
  equals(other: ValueObject): boolean {
    if (other === null || other === undefined) {
      return false;
    }

    if (this.constructor !== other.constructor) {
      return false;
    }

    return this.getEqualityComponents().every((component, index) => {
      const otherComponent = other.getEqualityComponents()[index];
      return this.deepEquals(component, otherComponent);
    });
  }

  /**
   * Returns the components that determine equality
   * Subclasses must implement this method to specify which attributes
   * should be used for equality comparison
   */
  protected abstract getEqualityComponents(): unknown[];

  /**
   * Deep equality comparison for components
   * Handles primitive types, objects, arrays, and nested comparisons
   */
  private deepEquals(a: unknown, b: unknown): boolean {
    if (a === b) {
      return true;
    }

    if (a === null || a === undefined || b === null || b === undefined) {
      return a === b;
    }

    if (typeof a !== typeof b) {
      return false;
    }

    // Handle arrays
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length !== b.length) {
        return false;
      }
      return a.every((item, index) => this.deepEquals(item, b[index]));
    }

    // Handle objects
    if (typeof a === 'object' && typeof b === 'object') {
      const keysA = Object.keys(a as object);
      const keysB = Object.keys(b as object);

      if (keysA.length !== keysB.length) {
        return false;
      }

      return keysA.every((key) => {
        return keysB.includes(key) && this.deepEquals((a as any)[key], (b as any)[key]);
      });
    }

    // Handle Date objects
    if (a instanceof Date && b instanceof Date) {
      return a.getTime() === b.getTime();
    }

    return false;
  }

  /**
   * Returns a string representation of the value object
   * Useful for debugging and logging
   */
  toString(): string {
    const components = this.getEqualityComponents();
    const componentStrings = components.map((component) => {
      if (component === null) return 'null';
      if (component === undefined) return 'undefined';
      if (typeof component === 'string') return `"${component}"`;
      if (typeof component === 'object') return JSON.stringify(component);
      return String(component);
    });

    return `${this.constructor.name}(${componentStrings.join(', ')})`;
  }

  /**
   * Returns a JSON representation of the value object
   * Useful for serialization
   */
  toJSON(): Record<string, unknown> {
    const components = this.getEqualityComponents();
    const result: Record<string, unknown> = {};

    // Try to create a meaningful JSON representation
    // This is a basic implementation that subclasses can override
    components.forEach((component, index) => {
      result[`component${index}`] = component;
    });

    return result;
  }

  /**
   * Creates a copy of this value object
   * Since value objects are immutable, this returns the same instance
   */
  copy(): this {
    return this;
  }
}

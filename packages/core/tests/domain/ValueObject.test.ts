import { describe, expect, it } from 'vitest';
import { ValueObject } from '../../src/domain/shared/ValueObject';

// Test value objects
class Money extends ValueObject {
  constructor(
    private readonly amount: number,
    private readonly currency: string
  ) {
    super();
  }

  getAmount(): number {
    return this.amount;
  }

  getCurrency(): string {
    return this.currency;
  }

  protected getEqualityComponents(): unknown[] {
    return [this.amount, this.currency];
  }
}

class Address extends ValueObject {
  constructor(
    private readonly street: string,
    private readonly city: string,
    private readonly zipCode: string
  ) {
    super();
  }

  getStreet(): string {
    return this.street;
  }

  protected getEqualityComponents(): unknown[] {
    return [this.street.toLowerCase(), this.city.toLowerCase(), this.zipCode];
  }
}

describe('ValueObject', () => {
  describe('equality', () => {
    it('should be equal when all equality components are equal', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(100, 'USD');

      expect(money1.equals(money2)).toBe(true);
    });

    it('should not be equal when equality components differ', () => {
      const money1 = new Money(100, 'USD');
      const money2 = new Money(100, 'EUR');
      const money3 = new Money(200, 'USD');

      expect(money1.equals(money2)).toBe(false);
      expect(money1.equals(money3)).toBe(false);
    });

    it('should handle complex equality components', () => {
      const address1 = new Address('123 Main St', 'New York', '10001');
      const address2 = new Address('123 MAIN ST', 'NEW YORK', '10001');
      const address3 = new Address('456 Oak Ave', 'New York', '10001');

      expect(address1.equals(address2)).toBe(true); // Case insensitive
      expect(address1.equals(address3)).toBe(false);
    });

    it('should not be equal to null or undefined', () => {
      const money = new Money(100, 'USD');

      expect(money.equals(null as any)).toBe(false);
      expect(money.equals(undefined as any)).toBe(false);
    });

    it('should not be equal to different value object types', () => {
      const money = new Money(100, 'USD');
      const address = new Address('123 Main St', 'New York', '10001');

      expect(money.equals(address as any)).toBe(false);
    });
  });

  describe('immutability', () => {
    it('should be immutable after creation', () => {
      const money = new Money(100, 'USD');

      // Values should not be modifiable from outside
      expect(money.getAmount()).toBe(100);
      expect(money.getCurrency()).toBe('USD');

      // Constructor parameters are private, so no direct access
      // This tests the design principle that value objects are immutable
    });

    it('should handle nested objects in equality components', () => {
      class PersonName extends ValueObject {
        constructor(
          private readonly first: string,
          private readonly last: string,
          private readonly metadata: { title?: string } = {}
        ) {
          super();
        }

        protected getEqualityComponents(): unknown[] {
          return [this.first.toLowerCase(), this.last.toLowerCase(), JSON.stringify(this.metadata)];
        }
      }

      const name1 = new PersonName('John', 'Doe', { title: 'Mr.' });
      const name2 = new PersonName('john', 'doe', { title: 'Mr.' });
      const name3 = new PersonName('John', 'Doe', { title: 'Dr.' });

      expect(name1.equals(name2)).toBe(true);
      expect(name1.equals(name3)).toBe(false);
    });
  });

  describe('self-equality', () => {
    it('should be equal to itself', () => {
      const money = new Money(100, 'USD');

      expect(money.equals(money)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty equality components', () => {
      class EmptyValue extends ValueObject {
        protected getEqualityComponents(): unknown[] {
          return [];
        }
      }

      const empty1 = new EmptyValue();
      const empty2 = new EmptyValue();

      expect(empty1.equals(empty2)).toBe(true);
    });

    it('should handle null values in equality components', () => {
      class NullableValue extends ValueObject {
        constructor(private readonly value: string | null) {
          super();
        }

        protected getEqualityComponents(): unknown[] {
          return [this.value];
        }
      }

      const nullable1 = new NullableValue(null);
      const nullable2 = new NullableValue(null);
      const nullable3 = new NullableValue('value');

      expect(nullable1.equals(nullable2)).toBe(true);
      expect(nullable1.equals(nullable3)).toBe(false);
    });
  });
});

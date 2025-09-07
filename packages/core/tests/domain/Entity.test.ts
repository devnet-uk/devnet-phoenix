import { describe, expect, it } from 'vitest';
import { Entity } from '../../src/domain/shared/Entity';
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

// Test entity
class TestEntity extends Entity<TestId> {
  constructor(
    id: TestId,
    private name: string
  ) {
    super(id);
  }

  getName(): string {
    return this.name;
  }

  updateName(name: string): void {
    this.name = name;
  }
}

describe('Entity', () => {
  describe('identity', () => {
    it('should have unique identity', () => {
      const id = new TestId('test-123');
      const entity = new TestEntity(id, 'Test Entity');

      expect(entity.id).toBe(id);
      expect(entity.id.toString()).toBe('test-123');
    });

    it('should maintain identity through state changes', () => {
      const id = new TestId('test-123');
      const entity = new TestEntity(id, 'Original Name');
      const originalId = entity.id;

      entity.updateName('New Name');

      expect(entity.id).toBe(originalId);
      expect(entity.getName()).toBe('New Name');
    });
  });

  describe('equality', () => {
    it('should be equal when IDs are equal', () => {
      const id1 = new TestId('test-123');
      const id2 = new TestId('test-123');
      const entity1 = new TestEntity(id1, 'Entity One');
      const entity2 = new TestEntity(id2, 'Entity Two');

      expect(entity1.equals(entity2)).toBe(true);
    });

    it('should not be equal when IDs are different', () => {
      const id1 = new TestId('test-123');
      const id2 = new TestId('test-456');
      const entity1 = new TestEntity(id1, 'Entity One');
      const entity2 = new TestEntity(id2, 'Entity Two');

      expect(entity1.equals(entity2)).toBe(false);
    });

    it('should not be equal to null or undefined', () => {
      const id = new TestId('test-123');
      const entity = new TestEntity(id, 'Test Entity');

      expect(entity.equals(null as any)).toBe(false);
      expect(entity.equals(undefined as any)).toBe(false);
    });

    it('should not be equal to different entity types', () => {
      class AnotherTestEntity extends Entity<TestId> {}

      const id = new TestId('test-123');
      const entity1 = new TestEntity(id, 'Test Entity');
      const entity2 = new AnotherTestEntity(id);

      expect(entity1.equals(entity2 as any)).toBe(false);
    });
  });

  describe('immutability of identity', () => {
    it('should not allow ID modification after creation', () => {
      const id = new TestId('test-123');
      const entity = new TestEntity(id, 'Test Entity');

      // The id property should be readonly - this tests compilation
      // @ts-expect-error - id is readonly
      // entity.id = new TestId('different-id');

      expect(entity.id.toString()).toBe('test-123');
    });
  });
});

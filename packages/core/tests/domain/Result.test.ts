import { describe, expect, it } from 'vitest';
import { Result } from '../../src/domain/shared/Result';

describe('Result', () => {
  describe('success cases', () => {
    it('should create successful result with value', () => {
      const result = Result.ok('test value');

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.value).toBe('test value');
      expect(result.error).toBeUndefined();
    });

    it('should create successful result with null value', () => {
      const result = Result.ok(null);

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeNull();
    });

    it('should create successful result with undefined value', () => {
      const result = Result.ok(undefined);

      expect(result.isSuccess).toBe(true);
      expect(result.value).toBeUndefined();
    });
  });

  describe('failure cases', () => {
    it('should create failed result with error message', () => {
      const result = Result.fail('Error occurred');

      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.error).toBe('Error occurred');
      expect(() => result.value).toThrow('Cannot get value from failed result');
    });

    it('should create failed result with Error object', () => {
      const error = new Error('Custom error');
      const result = Result.fail(error);

      expect(result.isFailure).toBe(true);
      expect(result.error).toBe(error);
    });
  });

  describe('combine method', () => {
    it('should return first failure when any result fails', () => {
      const success1 = Result.ok('value1');
      const success2 = Result.ok('value2');
      const failure = Result.fail('Error');

      const combined = Result.combine([success1, failure, success2]);

      expect(combined.isFailure).toBe(true);
      expect(combined.error).toBe('Error');
    });

    it('should return success with all values when all results succeed', () => {
      const success1 = Result.ok('value1');
      const success2 = Result.ok('value2');
      const success3 = Result.ok('value3');

      const combined = Result.combine([success1, success2, success3]);

      expect(combined.isSuccess).toBe(true);
      expect(combined.value).toEqual(['value1', 'value2', 'value3']);
    });

    it('should handle empty array', () => {
      const combined = Result.combine([]);

      expect(combined.isSuccess).toBe(true);
      expect(combined.value).toEqual([]);
    });
  });

  describe('map method', () => {
    it('should transform successful result value', () => {
      const result = Result.ok(5);
      const mapped = result.map((x) => x * 2);

      expect(mapped.isSuccess).toBe(true);
      expect(mapped.value).toBe(10);
    });

    it('should not transform failed result', () => {
      const result = Result.fail('Error');
      const mapped = result.map((x) => x * 2);

      expect(mapped.isFailure).toBe(true);
      expect(mapped.error).toBe('Error');
    });
  });

  describe('flatMap method', () => {
    it('should chain successful results', () => {
      const result = Result.ok(5);
      const chained = result.flatMap((x) => Result.ok(x * 2));

      expect(chained.isSuccess).toBe(true);
      expect(chained.value).toBe(10);
    });

    it('should return failure from chain', () => {
      const result = Result.ok(5);
      const chained = result.flatMap((_x) => Result.fail('Chain error'));

      expect(chained.isFailure).toBe(true);
      expect(chained.error).toBe('Chain error');
    });

    it('should not execute chain on failed result', () => {
      const result = Result.fail('Initial error');
      const chained = result.flatMap((x) => Result.ok(x * 2));

      expect(chained.isFailure).toBe(true);
      expect(chained.error).toBe('Initial error');
    });
  });
});

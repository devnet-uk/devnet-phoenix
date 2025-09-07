/**
 * Result Pattern Implementation
 *
 * Represents the result of an operation that can either succeed with a value
 * or fail with an error. This pattern eliminates the need for throwing
 * exceptions in business logic and makes error handling explicit.
 */
export class Result<T> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: string | Error
  ) {}

  /**
   * Creates a successful result with the provided value
   */
  static ok<U>(value: U): Result<U> {
    return new Result<U>(true, value);
  }

  /**
   * Creates a failed result with the provided error
   */
  static fail<U>(error: string | Error): Result<U> {
    return new Result<U>(false, undefined, error);
  }

  /**
   * Combines multiple results into a single result
   * Returns the first failure, or success with all values
   */
  static combine<U>(results: Result<U>[]): Result<U[]> {
    const values: U[] = [];

    for (const result of results) {
      if (result.isFailure) {
        return Result.fail<U[]>(result.error!);
      }
      values.push(result.value);
    }

    return Result.ok(values);
  }

  /**
   * Returns true if the result represents a success
   */
  get isSuccess(): boolean {
    return this._isSuccess;
  }

  /**
   * Returns true if the result represents a failure
   */
  get isFailure(): boolean {
    return !this._isSuccess;
  }

  /**
   * Gets the value from a successful result
   * Throws an error if the result is a failure
   */
  get value(): T {
    if (!this._isSuccess) {
      throw new Error('Cannot get value from failed result');
    }
    return this._value!;
  }

  /**
   * Gets the error from a failed result
   * Returns undefined if the result is a success
   */
  get error(): string | Error | undefined {
    return this._error;
  }

  /**
   * Transforms the value of a successful result using the provided function
   * Returns a new Result with the transformed value, or the original failure
   */
  map<U>(fn: (value: T) => U): Result<U> {
    if (this.isFailure) {
      return Result.fail<U>(this._error!);
    }

    try {
      return Result.ok(fn(this.value));
    } catch (error) {
      return Result.fail<U>(error instanceof Error ? error : String(error));
    }
  }

  /**
   * Chains results together, allowing for monadic composition
   * If this result is successful, applies the function and returns its result
   * If this result is a failure, returns the failure without calling the function
   */
  flatMap<U>(fn: (value: T) => Result<U>): Result<U> {
    if (this.isFailure) {
      return Result.fail<U>(this._error!);
    }

    try {
      return fn(this.value);
    } catch (error) {
      return Result.fail<U>(error instanceof Error ? error : String(error));
    }
  }

  /**
   * Returns the value if successful, otherwise returns the provided default value
   */
  valueOrDefault(defaultValue: T): T {
    return this.isSuccess ? this.value : defaultValue;
  }

  /**
   * Executes the provided function if the result is successful
   * Returns the original result for chaining
   */
  onSuccess(fn: (value: T) => void): Result<T> {
    if (this.isSuccess) {
      fn(this.value);
    }
    return this;
  }

  /**
   * Executes the provided function if the result is a failure
   * Returns the original result for chaining
   */
  onFailure(fn: (error: string | Error) => void): Result<T> {
    if (this.isFailure) {
      fn(this._error!);
    }
    return this;
  }
}
